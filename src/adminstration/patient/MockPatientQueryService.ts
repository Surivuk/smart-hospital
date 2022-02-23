import PatientQueryService, { PatientReadModel } from "./PatientQueryService";
import fs from "fs"

export default class MockPatientQueryService implements PatientQueryService {
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