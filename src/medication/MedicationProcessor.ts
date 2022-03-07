import CommandChain from "@app/CommandChain";
import { CreateExamination, DetermineTherapy, OpenHospitalTreatment, PrescribeTherapy } from "@app/commands/MedicationCommands";
import EventBus from "@app/EventBus"
import Guid from "@common/Guid";
import { HospitalTreatmentOpened } from "@events/MedicationEvents";
import Examination from "./examination/Examination";
import ExaminationRepository from "./examination/ExaminationRepository";
import HospitalTreatment from "./hospitalTreatment/HospitalTreatment";
import HospitalTreatmentRepository from "./hospitalTreatment/HospitalTreatmentRepository";
import MedicalCardRepository from "./medicalCard/MedicalCardRepository";
import Therapy from "./therapy/Therapy";
import TherapyRepository from "./therapy/TherapyRepository";

export default class MedicationProcessor {

    constructor(
        private readonly _medicalCardRepository: MedicalCardRepository,
        private readonly _examinationRepository: ExaminationRepository,
        private readonly _therapyRepository: TherapyRepository,
        private readonly _treatmentRepository: HospitalTreatmentRepository,
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
            .registerProcessor<PrescribeTherapy>(PrescribeTherapy.name, async ({ medicalCardId, therapyId, medicaments }) => {
                const medicalCard = await this._medicalCardRepository.medicalCard(medicalCardId);
                const therapy = Therapy.create(therapyId);
                therapy.addMedicaments(medicaments)
                await this._therapyRepository.save(therapy)
                medicalCard.noteTherapy(therapyId)
                await this._medicalCardRepository.save(medicalCard);
            })
            .registerProcessor<OpenHospitalTreatment>(OpenHospitalTreatment.name, async ({ medicalCardId, treatmentId }) => {
                const medicalCard = await this._medicalCardRepository.medicalCard(medicalCardId);
                await this._treatmentRepository.save(HospitalTreatment.create(treatmentId, medicalCardId))
                medicalCard.noteHospitalTreatment(treatmentId)
                await this._medicalCardRepository.save(medicalCard);
                this._eventBus.emit(new HospitalTreatmentOpened(treatmentId))
            })
            .registerProcessor<DetermineTherapy>(DetermineTherapy.name, async ({ treatmentId, therapyId, medicaments }) => {
                const treatment = await this._treatmentRepository.treatment(treatmentId);
                const therapy = Therapy.create(therapyId);
                therapy.addMedicaments(medicaments)
                await this._therapyRepository.save(therapy)
                treatment.addTherapy(therapyId)
                await this._treatmentRepository.save(treatment);
            })
    }
}