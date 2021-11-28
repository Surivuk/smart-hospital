import CommandChain from "@app/CommandChain";
import { GuidFactory } from "@helper/Guid";
import HospitalTreatment from "./HospitalTreatment";
import { AddTherapyToTreatment, CreateHospitalTreatment } from "./HospitalTreatmentCommands";
import HospitalTreatmentRepository from "./HospitalTreatmentRepository";


export default class HospitalTreatmentProcessors {
    constructor(private readonly _repository: HospitalTreatmentRepository) { }

    register(chain: CommandChain): CommandChain {
        return chain
            .registerProcessor<CreateHospitalTreatment>(CreateHospitalTreatment.name, async (command) => {
                await this._repository.save(HospitalTreatment.create(GuidFactory.guid(), command.medicalCardId, command.doctorId))
            })
            .registerProcessor<AddTherapyToTreatment>(AddTherapyToTreatment.name, async (command) => {
                const therapy = await this._repository.treatment(command.treatmentId)
                therapy.addTherapy(command.therapyId)
                await this._repository.save(therapy)
            })
    }
}