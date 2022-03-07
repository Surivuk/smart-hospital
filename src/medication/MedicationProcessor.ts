import CommandChain from "@app/CommandChain";
import { AddMedicamentToTherapy, ChangeTherapyLabel, CreateExamination, DetermineTherapy, OpenHospitalTreatment, PrescribeTherapy, RemoveMedicamentFromTherapy, RemoveTherapyFromTreatment } from "@app/commands/MedicationCommands";
import EventBus from "@app/EventBus"
import NormalStringField from "@common/fields/NormalStringField";
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
                const therapy = Therapy.create(therapyId, NormalStringField.create(""));
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
            .registerProcessor<DetermineTherapy>(DetermineTherapy.name, async ({ treatmentId, therapyId, treatmentLabel, medicaments }) => {
                const treatment = await this._treatmentRepository.treatment(treatmentId);
                const therapy = Therapy.create(therapyId, treatmentLabel);
                therapy.addMedicaments(medicaments)
                await this._therapyRepository.save(therapy)
                treatment.addTherapy(therapyId)
                await this._treatmentRepository.save(treatment);
            })
            .registerProcessor<AddMedicamentToTherapy>(AddMedicamentToTherapy.name, async ({ therapyId, medicament }) => {
                const therapy = await this._therapyRepository.therapy(therapyId);
                therapy.addMedicament(medicament)
                await this._therapyRepository.save(therapy)
            })
            .registerProcessor<RemoveMedicamentFromTherapy>(RemoveMedicamentFromTherapy.name, async ({ therapyId, medicamentId }) => {
                const therapy = await this._therapyRepository.therapy(therapyId);
                therapy.removeMedicament(medicamentId)
                await this._therapyRepository.save(therapy)
            })
            .registerProcessor<ChangeTherapyLabel>(ChangeTherapyLabel.name, async ({ therapyId, label }) => {
                const therapy = await this._therapyRepository.therapy(therapyId);
                therapy.changeLabel(label)
                await this._therapyRepository.save(therapy)
            })
            .registerProcessor<RemoveTherapyFromTreatment>(RemoveTherapyFromTreatment.name, async ({ therapyId, treatmentId }) => {
                const treatment = await this._treatmentRepository.treatment(treatmentId);
                treatment.removeTherapy(therapyId)
                await this._treatmentRepository.save(treatment)
            })
    }
}