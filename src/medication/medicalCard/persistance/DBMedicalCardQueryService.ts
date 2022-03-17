import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import MedicalCardQueryService, { MedicalCardReadModel } from "../MedicalCardQueryService";

export class DBMedicalCardQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBMedicalCardQueryService] Error - ${message}`);
    }
}

export default class DBMedicalCardQueryService extends KnexConnector implements MedicalCardQueryService {
    private _medicalCard = "medication.medical_card"
    private _notedEvents = "medication.noted_events"
    async medicalCard(id: Guid): Promise<MedicalCardReadModel> {
        try {
            const rows = await this.knex(this._medicalCard).where({ id: id.toString() })
            const notedEventsRows = await this.knex(this._notedEvents).where({ medical_card: id.toString() })
            if (rows.length === 0) throw new Error(`Not found medicalCard for provided id. Id: "${id.toString()}"`)
            return rows.map(row => this.toMedicalCard(row, notedEventsRows))[0]
        } catch (error) {
            throw new DBMedicalCardQueryServiceError(`[medicalCard] - ${error.message}`);
        }
    }
    async medicalCards(): Promise<MedicalCardReadModel[]> {
        try {
            const rows = await this.knex(this._medicalCard)
            const notedEventsRows = await this.knex(this._notedEvents)
            return rows.map(row => this.toMedicalCard(row, notedEventsRows))
        } catch (error) {
            throw new DBMedicalCardQueryServiceError(`[medicalCard] - ${error.message}`);
        }
    }
    toMedicalCard(row: any, notedEventsRows: any[]): MedicalCardReadModel {
        const myEvents = notedEventsRows.filter(e => e.medical_card === row.id);
        return {
            id: row.id,
            examinations: myEvents.filter(e => e.type === "EXAMINATION").map(e => ({ examinationId: e.event_id, createdAt: e.created_at })),
            therapies: myEvents.filter(e => e.type === "THERAPY").map(e => ({ therapyId: e.event_id, createdAt: e.created_at })),
            hospitalTreatments: myEvents.filter(e => e.type === "TREATMENT").map(e => ({ treatmentId: e.event_id, createdAt: e.created_at })),
            createdAt: row.created_at
        }
    }
}