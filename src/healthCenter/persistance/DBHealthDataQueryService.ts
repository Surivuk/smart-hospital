import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import HealthDataQueryService, { HealthDataReadModel } from "@healthCenter/HealthDataQueryService";

export class DBHealthDataQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBHealthDataQueryService] Error - ${message}`);
    }
}

export default class DBHealthDataQueryService extends KnexConnector implements HealthDataQueryService {
    async healthDataPerDate(treatmentId: Guid, date: Date): Promise<HealthDataReadModel[]> {
        try {
            const start = new Date(date)
            start.setDate(start.getDate() - 1)
            const end = new Date(date)
            end.setDate(end.getDate() + 1)
            const result = await this.knex.raw(`SELECT * 
            FROM health_center.health_data 
            WHERE hospital_treatment = ? AND CAST("timestamp"  AS DATE) = ?`, [treatmentId.toString(), `${this.adapt(date)}%`])

            return result.rows.map((row: any) => ({ ...row }));
        } catch (error) {
            throw new DBHealthDataQueryServiceError(`[healthDataPerDate] - ${error.message}`);
        }
    }

    private adapt(date: Date) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}-${month}-${day}`
    }
}