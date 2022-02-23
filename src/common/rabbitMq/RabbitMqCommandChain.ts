import CommandChain, { ChainCommand, Processor } from "@app/CommandChain";
import amqp from 'amqplib/callback_api';
import CommandAdapter from "./CommandAdapter";
import { queue } from "./rabbitMq";
import { GuidFactory } from "@common/Guid";

interface CommandAck {
    type: "success" | "error"
    value?: string
}

class SuccessAck implements CommandAck {
    public readonly type: "success" = "success"
    public readonly value = undefined;
}
class ErrorAck implements CommandAck {
    public readonly type: "error" = "error"
    constructor(public readonly value: string) { }
}

export default class RabbitMqCommandChain implements CommandChain {

    private _serverQueue!: amqp.Replies.AssertQueue
    private _clientQueue!: amqp.Replies.AssertQueue

    private readonly _completedAckMap = new Map<string, CommandAck>()
    private readonly _ackWaitingList: string[] = [];
    private readonly _processors: Map<string, Processor<any>> = new Map()

    constructor(
        private readonly _serverChannel: amqp.Channel,
        private readonly _clientChannel: amqp.Channel,
        private readonly _adapter: CommandAdapter
    ) { }

    async start() {
        this._serverQueue = await queue(this._serverChannel)
        this._serverChannel.prefetch(1);

        this._clientQueue = await queue(this._clientChannel)

        // ACK
        this.handleAck();

        // PROCESSOR
        this.handleCommand();
    }


    registerProcessor<T extends ChainCommand>(commandName: string, processor: Processor<T>): this {
        this._processors.set(commandName, processor);
        return this;
    }
    async process(command: ChainCommand): Promise<void> {
        const correlationId = GuidFactory.guid().toString()

        const message = (command: ChainCommand) => {
            return JSON.stringify({
                name: command.constructor.name,
                command: this._adapter.serialize(command)
            })
        }

        const result = this._clientChannel.sendToQueue(this._serverQueue.queue,
            Buffer.from(message(command)), {
            correlationId: correlationId,
            replyTo: this._clientQueue.queue
        });

        if (result) {
            this._ackWaitingList.push(correlationId)

            const ack = await this.waitOnAck(correlationId);

            if (ack.type === "success")
                return;
            else
                throw new Error(ack.value);
        }
        else
            throw new Error("Command not sent")
    }

    private handleCommand() {
        this._serverChannel.consume(this._serverQueue.queue, async (msg) => {
            if (msg === null)
                return;
            const ack = (ack: CommandAck) => {
                this._serverChannel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify(ack)), { correlationId: msg.properties.correlationId }
                );
                this._serverChannel.ack(msg);
            };
            const message: any = JSON.parse(msg.content.toString());
            const command = this._adapter.deserialize(message.name, message.command);
            try {
                const processor = this._processors.get(message.name);
                if (processor === undefined)
                    throw new Error(`Not found registered processor for command. Command name: "${message.name}"`);
                await processor(command);
                ack(new SuccessAck());
            } catch (error) {
                ack(new ErrorAck(error.message));
            }
        });
    }
    private handleAck() {
        this._clientChannel.consume(this._clientQueue.queue, async (msg) => {
            if (msg === null)
                return;
            if (this._ackWaitingList.indexOf(msg.properties.correlationId) !== -1) {
                this._completedAckMap.set(msg.properties.correlationId, JSON.parse(msg.content.toString()));
                var index = this._ackWaitingList.indexOf(msg.properties.correlationId);
                if (index !== -1)
                    this._ackWaitingList.splice(index, 1);
            }
        }, { noAck: true });
    }
    private async waitOnAck(correlationId: string): Promise<CommandAck> {
        return new Promise<CommandAck>((resolve, reject) => {
            let times = 20;
            const check = () => {
                setTimeout(() => {
                    const ack = this._completedAckMap.get(correlationId)
                    if (ack !== undefined)
                        resolve(ack);
                    else {
                        if (times < 1) {
                            reject(new Error("Timeout"))
                            return;
                        }
                        check()
                    }
                }, 500)
                times -= 1;
            }
            check()
        })
    }
}