import EventBus from "@app/EventBus";
import { HospitalTreatmentOpened } from "@events/MedicationEvents";
import MonitoringRepository from "./MonitoringRepository";

export default class MonitoringEventHandlers {

    constructor(private readonly _monitoringRepository: MonitoringRepository) { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<HospitalTreatmentOpened>(HospitalTreatmentOpened.name, async ({ treatmentId }) => {
                try {
                    await this._monitoringRepository.connectToFirstAvailableMonitoring(treatmentId)
                } catch (error) {
                    // emit NOT AVAILABLE MONITORING DEVICES 
                    throw error;
                }
            })
    }
}