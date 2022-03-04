import EventBus from "@app/EventBus";
import { HealthDataReceived } from "@events/MonitoringEvents";
import HealthStorage from "./HealthStorage";

export default class HealthCenterEventHandlers {

    constructor(private readonly _storage: HealthStorage) { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<HealthDataReceived>(HealthDataReceived.name, async ({ treatmentId, healthData }) => {
                this._storage.storeHealthData(treatmentId, healthData)
            })
    }
}