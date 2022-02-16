import EventBus, { DomainEvent, EventHandler } from "@app/EventBus";
import amqp from 'amqplib/callback_api';
import DomainEventAdapters from "./DomainEventAdapters";
import { queue } from "./rabbitMq";

export default class RabbitMqEventBus implements EventBus {

    private _queue!: amqp.Replies.AssertQueue

    constructor(private readonly _channel: amqp.Channel, private readonly _adapter: DomainEventAdapters) { }

    async start() {
        this._queue = await queue(this._channel)
    }

    on<T extends DomainEvent>(eventName: string, eventHandler: EventHandler<T>): this {
        const queue = this._queue.queue;
        this.assertExchange(eventName)
        this._channel.bindQueue(queue, eventName, '');
        this._channel.consume(queue, (msg) => {
            if (msg === null) return;
            if (msg.content) {
                try {
                    eventHandler(this._adapter.toEvent(eventName, JSON.parse(msg.content.toString())))
                } catch (error) {
                    throw error
                }
            }
        }, { noAck: true });

        return this;
    }
    emit(event: DomainEvent): void {
        const topic = event.constructor.name;
        this.assertExchange(topic)
        this._channel.publish(topic, '', Buffer.from(JSON.stringify(this._adapter.toJSON(event))));
    }

    private assertExchange(topic: string) {
        this._channel.assertExchange(topic, 'fanout', { durable: false, autoDelete: true });
    }
}