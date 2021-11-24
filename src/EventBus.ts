export interface DomainEvent { }

interface Handler<T extends DomainEvent> {
    (message: T): Promise<void>
}

export default class EventBus {
    private readonly _handlers = new Map<string, Handler<any>[]>();

    on<T extends DomainEvent>(eventName: string, eventHandler: Handler<T>): this {
        const handlers = this._handlers.get(eventName);
        if (handlers === undefined)
            this._handlers.set(eventName, [eventHandler]);
        else
            handlers.push(eventHandler)
        return this
    }
    emit(event: DomainEvent): void {
        const handlers = this._handlers.get(event.constructor.name);
        if (handlers)
            handlers.forEach(handler => handler(event))
    }
}

