import { DomainEvent } from "@app/EventBus";
import { HealthDataReceived } from "@events/MonitoringEvents";
import Guid from "@helper/Guid";

interface JsonAdapter<T extends DomainEvent> {
    (event: T): any
}
interface EventAdapter<T extends DomainEvent> {
    (data: any): T
}

export class DomainEventAdapterError extends Error {
    constructor(message: string) {
        super(`[DomainEventAdapter] Error - ${message}`);
    }
}

export default class DomainEventAdapters {

    private readonly _jsonAdapters: { [key: string]: JsonAdapter<any> } = {
        [HealthDataReceived.name]: ({ treatmentId, healthData }: HealthDataReceived) => ({
            treatmentId: treatmentId.toString(),
            type: healthData.type,
            timestamp: healthData.timestamp,
            value: healthData.value,
        })
    }
    private readonly _eventAdapters: { [key: string]: EventAdapter<any> } = {
        [HealthDataReceived.name]: ({ treatmentId, type, timestamp, value }) => new HealthDataReceived(new Guid(treatmentId), { type, timestamp, value })
    }


    toJSON(event: DomainEvent) {
        const adapter = this._jsonAdapters[event.constructor.name]
        if (adapter === undefined)
            throw new DomainEventAdapterError(`Not found json adapter for provided event. Event: "${event.constructor.name}"`)
        return adapter(event);
    }

    toEvent(topic: string, data: any) {
        const adapter = this._eventAdapters[topic]
        if (adapter === undefined)
            throw new DomainEventAdapterError(`Not found event adapter for provided data. Topic: "${topic}"`)
        return adapter(data);
    }
}