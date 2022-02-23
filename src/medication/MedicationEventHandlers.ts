import EventBus from "@app/EventBus";
import { PatientAdded } from "@events/AdministrationEvents";

export default class MedicationEventHandler {
    registerHandlers(eventBus: EventBus) {
        eventBus
        .on<PatientAdded>(PatientAdded.name, async (event) => {
            console.log("PatientAdded", event)
        })
    }
}