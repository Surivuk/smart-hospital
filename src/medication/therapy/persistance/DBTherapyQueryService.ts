import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import TherapyQueryService, { TherapyReadModel } from "../TherapyQueryService";

export class DBTherapyQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBTherapyQueryService] Error - ${message}`);
    }
}

export default class DBTherapyQueryService extends KnexConnector implements TherapyQueryService {
    async therapy(id: Guid): Promise<TherapyReadModel> {
        try {
            const therapy = await this.knex("therapy").where({ id: id.toString() })
            if (therapy.length === 0) throw new Error(`Not found therapy for provided id. Id: "${therapy.toString()}"`)
            const medicaments = await this.knex("therapy_medicaments").where({ therapy: id.toString() })
            return this.toTherapy(therapy[0], medicaments);
        } catch (error) {
            throw new DBTherapyQueryServiceError(`[therapy] - ${error.message}`);
        }
    }
    async therapies(): Promise<TherapyReadModel[]> {
        try {
            const therapies = await this.knex("therapy")
            const medicaments = await this.knex("therapy_medicaments").whereIn("therapy", therapies.map(t => t.id))
            return therapies.map(therapy => this.toTherapy(therapy, medicaments.filter(m => m.therapy === therapy.id)))
        } catch (error) {
            throw new DBTherapyQueryServiceError(`[therapies] - ${error.message}`);
        }
    }

    private toTherapy(data: any, medications: any[]): TherapyReadModel {
        return {
            id: data.id,
            medicaments: medications.map(medication => ({
                medicamentId: medication.medicament_id,
                strength: medication.strength,
                amount: medication.amount,
                route: medication.route,
                frequency: medication.frequency
            }))
        }
    }
}