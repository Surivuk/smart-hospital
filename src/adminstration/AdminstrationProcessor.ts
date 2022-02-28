import CommandChain from "@app/CommandChain";
import EventBus from "@app/EventBus"
import AddPatient from "@app/commands/AdministrationCommands";
import PatientRepository from "./patient/PatientRepository";
import { PatientAdded } from "@events/AdministrationEvents";
import { GuidFactory } from "@common/Guid";

export default class AdminstrationProcessor {

    constructor(
        private readonly _patientRepo: PatientRepository,
        private readonly _eventBus: EventBus
    ) { }

    registerProcesses(commandChain: CommandChain) {
        commandChain
            .registerProcessor<AddPatient>(AddPatient.name, async ({ patientId, name, gender, birthYear }) => {
                await await this._patientRepo.createPatient(patientId, name, gender, birthYear)
                this._eventBus.emit(new PatientAdded(patientId))
            })
    }
}