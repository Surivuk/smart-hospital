import KnexConnector from "@common/db/KnexConnector";
import DoctorQueryService, { DoctorReadModel } from "./DoctorQueryService";

export class DBDoctorQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBDoctorQueryService] Error - ${message}`);
    }
}

export default class DBDoctorQueryService extends KnexConnector implements DoctorQueryService {
    async doctors(): Promise<DoctorReadModel[]> {
        try {
            return (await this.knex("administration.doctor")).map(d => this.toDoctor(d))
        } catch (error) {
            throw new DBDoctorQueryServiceError(`[doctors] - ${error.message}`); 
        }
    }
    toDoctor(row: any): DoctorReadModel {
        return {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            gender: row.gender,
            createdAt: row.created_at
        }
    }

}