import KnexConnector from "@common/db/KnexConnector";
import MedicamentQueryService, { MedicamentReadModel } from "../MedicamentQueryService";

export class DBMedicamentQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBMedicamentQueryService] Error - ${message}`);
    }
}

export default class DBMedicamentQueryService extends KnexConnector implements MedicamentQueryService {
    async medicaments(): Promise<MedicamentReadModel[]> {
        try {
            const rows = await this.knex("medicaments")
            return rows.map(({ id, name }) => ({ id, name }))
        } catch (error) {
            throw new DBMedicamentQueryServiceError(`[medicaments] - ${error.message}`);
        }
    }
}