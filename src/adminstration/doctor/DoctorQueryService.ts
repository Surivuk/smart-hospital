export class DoctorReadModel {
    constructor(
        public readonly id: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly gender: string,
        public readonly createdAt: string
    ) { }
}

export default interface DoctorQueryService {
    doctors(): Promise<DoctorReadModel[]>
}