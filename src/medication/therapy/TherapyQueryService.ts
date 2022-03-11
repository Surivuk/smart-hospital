import Guid from "@common/Guid";

export type TherapyReadModel = {
    id: string;
    label: string,
    type: string
    medicaments: Medicament[]
}
export type Medicament = {
    medicamentId: string;
    name: string
    strength: string;
    amount: number;
    route: number;
    frequency: string;
    createdAt: string;
}

export default interface TherapyQueryService {
    therapy(id: Guid): Promise<TherapyReadModel>
    therapies(): Promise<TherapyReadModel[]>;
    therapiesForTreatmentUntil(treatment: Guid, date: Date): Promise<Medicament[]>;
}