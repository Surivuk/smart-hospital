import EventBus from "@app/EventBus";
import { HealthDataReceived } from "@events/MonitoringEvents";

export default class HealthDataEventHandlers {

    constructor() { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<HealthDataReceived>(HealthDataReceived.name, async ({ treatmentId, healthData }) => {
                console.log(treatmentId, healthData)
            })
    }
}