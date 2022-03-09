import PatientQueryService, { PatientReadModel } from "./PatientQueryService";
import fs from "fs"
import Guid from "@common/Guid";

export default class MockPatientQueryService implements PatientQueryService {
    async patient(id: Guid): Promise<PatientReadModel> {
        const patients = await this.patients()
        const patient = patients.find(p => p.id === id.toString())
        return this.toPatient(patient);
    }
    patients(): Promise<PatientReadModel[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(`${__dirname}/../mock/patients.json`, "utf8", (err, data) => {
                if (err) {
                    reject(err.message)
                    return
                }
                resolve((JSON.parse(data) as any[]).map(p => this.toPatient(p)));
            })
        })
    }

    private toPatient(data: any): PatientReadModel {
        return new PatientReadModel(
            data.id,
            data.firstName,
            data.lastName,
            data.birthYear,
            data.gender,
        )
    }
}