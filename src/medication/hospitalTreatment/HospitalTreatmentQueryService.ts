import Guid from "@common/Guid";

export type HospitalTreatmentReadModel = {
    id: string;
    medicalCard: string
    diagnosis: string
    closed: boolean,
    createdAt: string
    closedAt?: string
}
export type HospitalTreatmentWithTherapiesReadModel = HospitalTreatmentReadModel & { therapies: { therapyId: string; label?: string, createdAt: string }[] }


export default interface HospitalTreatmentQueryService {
    treatment(id: Guid): Promise<HospitalTreatmentWithTherapiesReadModel>
    treatments(): Promise<HospitalTreatmentReadModel[]>
    treatmentsForMedicalCard(medicalCardId: Guid): Promise<HospitalTreatmentWithTherapiesReadModel[]>
}