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
            const result = await this.knex.raw(`SELECT 
                hospital_treatment,
                type,
                value, 
                ROUND(EXTRACT (EPOCH FROM timestamp) * 1000) AS timestamp
            FROM health_center.health_data 
            WHERE hospital_treatment = ? AND CAST("timestamp"  AS DATE) = ?
            ORDER BY timestamp ASC`, [treatmentId.toString(), `${this.adapt(date)}%`])

            return result.rows.map((row: any) => ({ ...row }));
        } catch (error) {
            throw new DBHealthDataQueryServiceError(`[healthDataPerDate] - ${error.message}`);
        }
    }

    private adapt(date: Date) {
        const year = date.getFullYear()
        const month = `${date.getMonth() + 1}`
        const day = `${date.getDate()}`
        return `${year}-${month.length === 1 ? `0${month}` : month}-${day.length === 0 ? `0${day}` : day}`
    }
}