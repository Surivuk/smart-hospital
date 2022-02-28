import Guid from "@common/Guid";

export interface MedicalCardReadModel {
    id: string;
    examinations: { examinationId: string, createdAt: string }[]
    createdAt: string;
}

export default interface MedicalCardQueryService {
    medicalCard(id: Guid): Promise<MedicalCardReadModel>;
    medicalCards(): Promise<MedicalCardReadModel[]>
}