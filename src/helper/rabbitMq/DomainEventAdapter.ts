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

export default class DomainEventAdapter {

    toJSON(event: DomainEvent): any {
        const adapters: { [key: string]: JsonAdapter<any> } = {
            [HealthDataReceived.name]: ({ treatmentId, healthData }: HealthDataReceived) => ({
                treatmentId: treatmentId.toString(),
                type: healthData.type,
                timestamp: healthData.timestamp,
                value: healthData.value,
            })
        }
        const adapter = adapters[event.constructor.name]
        if (adapter === undefined)
            throw new DomainEventAdapterError(`Event not found. Name: "${event.constructor.name}"`)
        return adapter(event);
    }

    toEvent(topic: string, data: any) {
        const adapters: { [key: string]: EventAdapter<any> } = {
            [HealthDataReceived.name]: ({ treatmentId, type, timestamp, value }) => new HealthDataReceived(new Guid(treatmentId), { type, timestamp, value })
        }
        const adapter = adapters[topic]
        if (adapter === undefined)
            throw new DomainEventAdapterError(`ENot found event adapter for provided data. Topic: "${topic}"`)
        return adapter(data);
    }



}