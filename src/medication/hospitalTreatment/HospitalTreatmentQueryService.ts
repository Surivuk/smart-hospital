import Guid from "@common/Guid";

export type HospitalTreatmentReadModel = {
    id: string;
    patient: string
    therapies: { therapyId: string; label?: string, createdAt: string }[]
    closed: boolean,
    createdAt: string
    closedAt?: string
}

export default interface HospitalTreatmentQueryService {
    treatment(id: Guid): Promise<HospitalTreatmentReadModel>
    treatments(medicalCardId: Guid): Promise<HospitalTreatmentReadModel[]>
}