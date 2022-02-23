import doctors from "../mock/doctors.json"
import DoctorQueryService, { DoctorReadModel } from "./DoctorQueryService";

export default class MockDoctorQueryService implements DoctorQueryService {
    async doctors(): Promise<DoctorReadModel[]> {
        return doctors.map(d => this.toDoctor(d));
    }

    private toDoctor(data: any): DoctorReadModel {
        return new DoctorReadModel(
            data.id,
            data.firstName,
            data.lastName,
            data.gender,
        )
    }
}