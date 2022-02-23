export class PatientReadModel {
    constructor(
        public readonly id: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly birthYear: number,
        public readonly gender: string
    ) { }
}

export default interface PatientQueryService {
    patients(): Promise<PatientReadModel[]>
}