export interface DomainEvent { }

export interface EventHandler<T extends DomainEvent> {
    (message: T): Promise<void>
}

export default interface EventBus {
    on<T extends DomainEvent>(eventName: string, eventHandler: EventHandler<T>): this;
    emit(event: DomainEvent): void;
}

export class TestEventBus implements EventBus {
    private readonly _handlers = new Map<string, EventHandler<any>[]>();

    on<T extends DomainEvent>(eventName: string, eventHandler: EventHandler<T>): this {
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

