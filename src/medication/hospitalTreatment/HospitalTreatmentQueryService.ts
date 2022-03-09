import Guid from "@common/Guid";

export type HospitalTreatmentReadModel = {
    id: string;
    therapies: { therapyId: string; label?: string, createdAt: string }[]
    createdAt: string
}

export default interface HospitalTreatmentQueryService {
    treatment(id: Guid): Promise<HospitalTreatmentReadModel>
    treatments(medicalCardId: Guid): Promise<HospitalTreatmentReadModel[]>
}