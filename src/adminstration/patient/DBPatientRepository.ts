import Gender from "@adminstration/Gender";
import Name from "@adminstration/Name";
import KnexConnector from "@common/db/KnexConnector";
import NumberField from "@common/fields/NumberField";
import Guid from "@common/Guid";
import PatientRepository from "./PatientRepository";

export class DBPatientRepositoryError extends Error {
    constructor(message: string) {
        super(`[DBPatientRepository] Error - ${message}`);
    }
}

export default class DBPatientRepository extends KnexConnector implements PatientRepository {
    async createPatient(id: Guid, name: Name, gender: Gender, birthDate: NumberField): Promise<void> {
        try {
            await this.knex("patient").insert({
                id: id.toString(),
                first_name: name.firstName,
                last_name: name.lastName,
                gender: gender.toString(),
                birth_year: birthDate.value(),
                created_at: this.knex.fn.now()
            })
        } catch (error) {
            throw new DBPatientRepositoryError(`[createPatient] - ${error.message}`)
        }
    }
}