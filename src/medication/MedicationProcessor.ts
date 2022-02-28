import CommandChain from "@app/CommandChain";
import CreateExamination from "@app/commands/MedicationCommands";
import EventBus from "@app/EventBus"
import Examination from "./examination/Examination";
import ExaminationRepository from "./examination/ExaminationRepository";
import MedicalCardRepository from "./medicalCard/MedicalCardRepository";

export default class MedicationProcessor {

    constructor(
        private readonly _medicalCardRepository: MedicalCardRepository,
        private readonly _examinationRepository: ExaminationRepository,
        private readonly _eventBus: EventBus
    ) { }

    registerProcesses(commandChain: CommandChain) {
        commandChain
            .registerProcessor<CreateExamination>(CreateExamination.name, async ({ medicalCardId, examinationId, diagnose, doctorId }) => {
                const medicalCard = await this._medicalCardRepository.medicalCard(medicalCardId);
                await this._examinationRepository.save(Examination.create(examinationId, doctorId, diagnose))
                medicalCard.noteExamination(examinationId)
                await this._medicalCardRepository.save(medicalCard);
            })
    }
}