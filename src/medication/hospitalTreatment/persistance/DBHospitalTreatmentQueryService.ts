import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import HospitalTreatmentQueryService, { HospitalTreatmentReadModel, HospitalTreatmentWithTherapiesReadModel } from "../HospitalTreatmentQueryService";

export class DBHospitalTreatmentQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBHospitalTreatmentQueryService] Error - ${message}`);
    }
}

export default class DBHospitalTreatmentQueryService extends KnexConnector implements HospitalTreatmentQueryService {

    private _hospitalTreatment = "medication.hospital_treatment";
    private _hospitalTreatmentTherapies = "medication.hospital_treatment_therapies_view"

    async treatment(id: Guid): Promise<HospitalTreatmentWithTherapiesReadModel> {
        try {
            const treatment = await this.knex(this._hospitalTreatment).where({ id: id.toString() })
                .leftJoin("medication.noted_events", "medication.hospital_treatment.id", "medication.noted_events.event_id")
            if (treatment.length === 0) throw new Error(`Not found treatment with provided id. Id: "${id.toString()}"`)
            const therapies = await this.knex(this._hospitalTreatmentTherapies).where({ hospital_treatment: treatment[0].id })
            return this.toTreatmentWithTherapy(treatment[0], therapies)
        } catch (error) {
            throw new DBHospitalTreatmentQueryServiceError(`[treatment] - ${error.message}`);
        }

    }
    async treatments(): Promise<HospitalTreatmentReadModel[]> {
        try {
            const rows = await this.knex(this._hospitalTreatment)
                .leftJoin("medication.noted_events", "medication.hospital_treatment.id", "medication.noted_events.event_id")
            return rows.map(treatment => this.toTreatment(treatment))
        } catch (error) {
            throw new DBHospitalTreatmentQueryServiceError(`[treatments] - ${error.message}`);
        }
    }
    async treatmentsForMedicalCard(medicalCardId: Guid): Promise<HospitalTreatmentWithTherapiesReadModel[]> {
        try {
            const treatments = await this.knex(this._hospitalTreatment)
                .leftJoin("medication.noted_events", "medication.hospital_treatment.id", "medication.noted_events.event_id")
                .where({ medical_card: medicalCardId.toString() })
            const therapies = await this.knex(this._hospitalTreatmentTherapies).whereIn("hospital_treatment", treatments.map(t => t.id))
            return treatments.map(treatment => this.toTreatmentWithTherapy(treatment, therapies.filter(t => t.hospital_treatment === treatment.id)))
        } catch (error) {
            throw new DBHospitalTreatmentQueryServiceError(`[treatments] - ${error.message}`);
        }
    }

    private toTreatment(data: any): HospitalTreatmentReadModel {
        return {
            id: data.id,
            medicalCard: data.medical_card,
            diagnosis: data.diagnosis,
            closed: data.closed !== null ? data.closed : false,
            createdAt: data.created_at,
            closedAt: data.closed_at !== null ? data.closed_at : undefined
        }
    }
    private toTreatmentWithTherapy(data: any, treatments: any[]): HospitalTreatmentWithTherapiesReadModel {
        return {
            ...this.toTreatment(data),
            therapies: treatments.map(t => ({ therapyId: t.therapy, label: t.label !== null ? t.label : undefined, createdAt: t.created_at }))
        }
    }
}