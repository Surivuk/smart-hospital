import Guid from "@common/Guid";

export type ExaminationReadModel = {
    id: string
    diagnosis: string
    createdAt: string
}

export default interface ExaminationQueryService {
    examination(id: Guid): Promise<ExaminationReadModel>
}