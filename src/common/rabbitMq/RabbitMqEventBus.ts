import EventBus, { DomainEvent, EventHandler } from "@app/EventBus";
import amqp from 'amqplib/callback_api';
import DomainEventAdapters from "./DomainEventAdapters";
import { queue } from "./rabbitMq";

export default class RabbitMqEventBus implements EventBus {

    private _queue!: amqp.Replies.AssertQueue
    private readonly _exchanger = "domain.event"
    private readonly _handlers: { eventName: string, handler: EventHandler<any> }[] = []

    constructor(private readonly _channel: amqp.Channel, private readonly _adapter: DomainEventAdapters) { }

    async start() {
        this._queue = await queue(this._channel)
        const queueName = this._queue.queue
        this.assertExchange(this._exchanger)
        this._channel.bindQueue(queueName, this._exchanger, '');
        this._channel.consume(queueName, async (msg) => {
            if (msg === null) return;
            if (msg.content) {
                const { eventName, data } = JSON.parse(msg.content.toString())
                try {
                    // const { eventName, data } = JSON.parse(msg.content.toString())
                    const eventHandlers = this.handlers(eventName)
                    if (eventHandlers.length === 0) throw new Error(`Not found handler for event. Event: "${eventName}"`)
                    await Promise.all(eventHandlers.map(handler => handler(this._adapter.toEvent(eventName, data))))
                } catch (error) {
                    console.log(`[EVENT BUS] -> [${eventName}] - ${error.message}`)
                }
            }
        }, { noAck: true });
    }

    on<T extends DomainEvent>(eventName: string, eventHandler: EventHandler<T>): this {
        this._handlers.push({ eventName, handler: eventHandler })
        return this;
    }
    emit(event: DomainEvent): void {
        this.assertExchange(this._exchanger)
        this._channel.publish(this._exchanger, '', Buffer.from(JSON.stringify({ eventName: event.constructor.name, data: this._adapter.toJSON(event) })));
    }

    private assertExchange(exchanger: string) {
        this._channel.assertExchange(exchanger, 'fanout', { durable: false, autoDelete: true });
    }
    private handlers(eName: string) {
        return this._handlers.filter(({ eventName }) => eventName === eName).map(({ handler }) => handler)
    }
}