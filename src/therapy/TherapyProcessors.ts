import CommandChain from "@app/CommandChain";
import { GuidFactory } from "@helper/Guid";
import Therapy from "./Therapy";
import { AddMedicationToTherapy, CreateTherapy, RemoveMedicationFromTherapy } from "./TherapyCommands";
import TherapyRepository from "./TherapyRepository";

export default class TherapyProcessors {
    constructor(private readonly _repository: TherapyRepository) { }

    register(chain: CommandChain): CommandChain {
        return chain
            .registerProcessor<CreateTherapy>(CreateTherapy.name, async (command) => {
                const therapy = Therapy.create(GuidFactory.guid())
                command.medications.forEach(medication => therapy.addMedication(medication));
                await this._repository.save(therapy)
            })
            .registerProcessor<AddMedicationToTherapy>(AddMedicationToTherapy.name, async (command) => {
                const therapy = await this._repository.therapy(command.therapyId)
                therapy.addMedication(command.medication)
                await this._repository.save(therapy)
            })
            .registerProcessor<RemoveMedicationFromTherapy>(RemoveMedicationFromTherapy.name, async (command) => {
                const therapy = await this._repository.therapy(command.therapyId)
                therapy.removeMedication(command.medicationId)
                await this._repository.save(therapy)
            })
    }
}