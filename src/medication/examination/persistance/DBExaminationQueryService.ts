import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import ExaminationQueryService, { ExaminationReadModel } from "../ExaminationQueryService";

export class DBExaminationQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBExaminationQueryService] Error - ${message}`);
    }
}

export default class DBExaminationQueryService extends KnexConnector implements ExaminationQueryService {
    async examination(id: Guid): Promise<ExaminationReadModel> {
        try {
            const rows = await this.knex("examination").where({ id: id.toString()})
            if(rows.length === 0) throw new Error(`Not found examination for provided id. Id: "${id}"`)
            return this.toExamination(rows[0])
        } catch (error) {
            throw new DBExaminationQueryServiceError(`[examination] - ${error.message}`);
        }
    }
    toExamination(data: any): ExaminationReadModel {
        return {
            id: data.id,
            diagnosis: data.diagnosis,
            createdAt: data.created_at
        }
    }

}