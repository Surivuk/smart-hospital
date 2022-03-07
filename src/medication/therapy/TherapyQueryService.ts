import Guid from "@common/Guid";

export type TherapyReadModel = {
    id: string;
    label: string,
    medicaments: {
        medicamentId: string;
        strength: string;
        amount: number;
        route: number;
        frequency: string;
    }[]
}

export default interface TherapyQueryService {
    therapy(id: Guid): Promise<TherapyReadModel>
    therapies(): Promise<TherapyReadModel[]>;
}