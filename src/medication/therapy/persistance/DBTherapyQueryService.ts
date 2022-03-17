import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import TherapyQueryService, { Medicament, TherapyReadModel } from "../TherapyQueryService";

export class DBTherapyQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBTherapyQueryService] Error - ${message}`);
    }
}

export default class DBTherapyQueryService extends KnexConnector implements TherapyQueryService {
    private _therapy = "medication.therapy"
    private _therapyMedicaments = "medication.therapy_medicaments"
    private _hospitalTreatmentTherapies = "medication.hospital_treatment_therapies"

    async therapy(id: Guid): Promise<TherapyReadModel> {
        try {
            const therapy = await this.knex(this._therapy).where({ id: id.toString() })
            if (therapy.length === 0) throw new Error(`Not found therapy for provided id. Id: "${therapy.toString()}"`)
            const medicaments = await this.knex(this._therapyMedicaments).where({ therapy: id.toString() })
            return this.toTherapy(therapy[0], medicaments);
        } catch (error) {
            throw new DBTherapyQueryServiceError(`[therapy] - ${error.message}`);
        }
    }
    async therapies(): Promise<TherapyReadModel[]> {
        try {
            const therapies = await this.knex(this._therapy)
            const medicaments = await this.knex(this._therapyMedicaments).whereIn("therapy", therapies.map(t => t.id))
            return therapies.map(therapy => this.toTherapy(therapy, medicaments.filter(m => m.therapy === therapy.id)))
        } catch (error) {
            throw new DBTherapyQueryServiceError(`[therapies] - ${error.message}`);
        }
    }
    async therapiesForTreatmentUntil(treatmentId: Guid, date: Date): Promise<Medicament[]> {
        try {
            const therapies = await this.knex(this._hospitalTreatmentTherapies).where({ hospital_treatment: treatmentId.toString() })
            const medicaments = await this.knex(this._therapyMedicaments)
                .whereIn("therapy", therapies.map(t => t.therapy))
                .whereRaw(`created_at < ?`, [date.toISOString()])

            return medicaments.map((row: any) => this.toMedicament(row))
        } catch (error) {
            throw new DBTherapyQueryServiceError(`[therapiesForTreatmentUntil] - ${error.message}`);
        }
    }

    private toMedicament(data: any): Medicament {
        return {
            medicamentId: data.medicament_id,
            name: data.medicament_name,
            strength: data.strength,
            amount: data.amount,
            route: data.route,
            frequency: data.frequency,
            createdAt: data.created_at
        }
    }

    private toTherapy(data: any, medications: any[]): TherapyReadModel {
        return {
            id: data.id,
            label: data.label !== null ? data.label : "",
            type: data.type,
            medicaments: medications.map(medicament => this.toMedicament(medicament))
        }
    }
}