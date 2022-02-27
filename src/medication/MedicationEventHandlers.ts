import EventBus from "@app/EventBus";
import Guid, { GuidFactory } from "@common/Guid";
import { PatientAdded } from "@events/AdministrationEvents";
import MedicalCard from "./medicalCard/MedicalCard";
import MedicalCardRepository from "./medicalCard/MedicalCardRepository";

export default class MedicationEventHandler {

    constructor(private readonly _medicalCardRepository: MedicalCardRepository) { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<PatientAdded>(PatientAdded.name, async ({ patientId }) => {
                if (await this.medicalCardExists(patientId)) {
                    console.log(`[EVENT BUS] - [MedicationEventHandler] - [PatientAdded] - Provided patient already has medical card. Patient: ${patientId}`)
                    return;
                }
                await this._medicalCardRepository.save(MedicalCard.create(patientId, patientId))
            })
    }

    private async medicalCardExists(patientId: Guid): Promise<boolean> {
        try {
            await this._medicalCardRepository.medicalCard(patientId);
            return true;
        } catch (error) {
            return false;
        }
    }
}