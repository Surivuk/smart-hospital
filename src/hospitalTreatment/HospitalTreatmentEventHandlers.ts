import EventBus from "@app/EventBus";
import { TherapyCreated } from "@events/DomainEvents";
import HospitalTreatmentRepository from "./HospitalTreatmentRepository";

export default class HospitalTreatmentEventHandlers {
    constructor(private readonly _repository: HospitalTreatmentRepository) { }
    register(bus: EventBus): EventBus {
        return bus
            .on<TherapyCreated>(TherapyCreated.name, async (event) => {
                const treatment = await this._repository.treatment(event.treatmentId);
                treatment.addTherapy(event.therapyId)
                await this._repository.save(treatment)
            })
    }
}