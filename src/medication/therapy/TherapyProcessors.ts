import TestCommandChain from "@app/CommandChain";
import EventBus from "@app/EventBus";
import { TherapyCreated } from "@events/DomainEvents";
import { GuidFactory } from "@common/Guid";
import Therapy from "./Therapy";
import { AddMedicationToTherapy, CreateTherapy, RemoveMedicationFromTherapy } from "./TherapyCommands";
import TherapyRepository from "./TherapyRepository";

export default class TherapyProcessors {
    constructor(private readonly _repository: TherapyRepository, private readonly _eventBus: EventBus) { }

    register(chain: TestCommandChain): TestCommandChain {
        return chain
            .registerProcessor<CreateTherapy>(CreateTherapy.name, async (command) => {
                const therapy = Therapy.create(GuidFactory.guid())
                command.medications.forEach(medication => therapy.addMedication(medication));
                await this._repository.save(therapy)
                this._eventBus.emit(new TherapyCreated(therapy.id, command.therapyId))
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