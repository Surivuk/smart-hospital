import Gender from "@adminstration/Gender";
import Name from "@adminstration/Name";
import KnexConnector from "@common/db/KnexConnector";
import NumberField from "@common/fields/NumberField";
import Guid from "@common/Guid";
import PatientQueryService, { PatientReadModel } from "./PatientQueryService";
import PatientRepository from "./PatientRepository";

export class DBPatientRepositoryError extends Error {
    constructor(message: string) {
        super(`[DBPatientRepository] Error - ${message}`);
    }
}

export default class DBPatientQueryService extends KnexConnector implements PatientQueryService {
    async patient(id: Guid): Promise<PatientReadModel> {
        try {
            const rows = await this.knex("patient").where({ id: id.toString() })
            if (rows.length === 0) throw new Error(`Not found patient fir provided id. Id: "${id.toString()}"`)
            return this.toPatient(rows[0])
        } catch (error) {
            throw new DBPatientRepositoryError(`[patient] - ${error.message}`);
        }
    }
    async patients(): Promise<PatientReadModel[]> {
        try {
            return (await this.knex("patient")).map(row => this.toPatient(row))
        } catch (error) {
            throw new DBPatientRepositoryError(`[patients] - ${error.message}`);
        }
    }

    private toPatient(data: any): PatientReadModel {
        return {
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            birthYear: data.birth_year,
            gender: data.gender
        }
    }
}