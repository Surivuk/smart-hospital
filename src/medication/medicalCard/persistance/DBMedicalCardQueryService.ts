import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import MedicalCardQueryService, { MedicalCardReadModel } from "../MedicalCardQueryService";

export class DBMedicalCardQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBMedicalCardQueryService] Error - ${message}`);
    }
}

export default class DBMedicalCardQueryService extends KnexConnector implements MedicalCardQueryService {
    async medicalCard(id: Guid): Promise<MedicalCardReadModel> {
        try {
            throw new Error()
        } catch (error) {
            throw new DBMedicalCardQueryServiceError(`[medicalCard] - ${error.message}`);
        }
    }
    async medicalCards(): Promise<MedicalCardReadModel[]> {
        try {
            const rows = await this.knex("medical_card")
            return rows.map(row => this.toMedicalCard(row))
        } catch (error) {
            throw new DBMedicalCardQueryServiceError(`[medicalCard] - ${error.message}`);
        }
    }
    toMedicalCard(row: any): MedicalCardReadModel {
        return {
            id: row.id,
            createdAt: row.created_at
        }
    }
}