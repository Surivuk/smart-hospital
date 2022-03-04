import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import HealthData from "@healthCenter/healthData/HealthData";
import HealthDataRepository from "@healthCenter/HealthDataRepository";

export class DBHealthDataRepositoryError extends Error {
    constructor(message: string) {
        super(`[DBHealthDataRepository] Error - ${message}`);
    }
}

export default class DBHealthDataRepository extends KnexConnector implements HealthDataRepository {
    async save(treatmentId: Guid, healthData: HealthData[]): Promise<void> {
        try {
            await this.knex("health_data").insert(healthData.map(data => ({
                hospital_treatment: treatmentId.toString(),
                type: data.type().toString(),
                value: data.value().toString(),
                timestamp: new Date(data.timestamp()).toISOString()
            })))
        } catch (error) {
            throw new DBHealthDataRepositoryError(`[save] - ${error.message}`);
        }
    }
}