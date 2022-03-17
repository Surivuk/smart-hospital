export type MedicamentReadModel = {
    id: string
    name: string
}

export default interface MedicamentQueryService {
    medicaments(): Promise<MedicamentReadModel[]>
}