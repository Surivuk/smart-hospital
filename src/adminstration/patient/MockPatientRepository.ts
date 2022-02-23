import { PatientReadModel } from "./PatientQueryService";
import fs from "fs"
import PatientRepository from "./PatientRepository";
import Gender from "@adminstration/Gender";
import Name from "@adminstration/Name";
import NumberField from "@common/fields/NumberField";
import Guid from "@common/Guid";

export default class MockPatientRepository implements PatientRepository {
    private _patientsPath = `${__dirname}/../mock/patients.json`

    async createPatient(id: Guid, name: Name, gender: Gender, birthDate: NumberField): Promise<void> {
        const patients = await this.patients()
        patients.push({
            id: id.toString(),
            firstName: name.firstName,
            lastName: name.lastName,
            gender: gender.toString(),
            birthYear: birthDate.value()
        })
        return new Promise((resolve, reject) => {
            fs.writeFile(this._patientsPath, JSON.stringify(patients), (err) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve()
            })
        })
    }

    private patients(): Promise<PatientReadModel[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(this._patientsPath, "utf8", (err, data) => {
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