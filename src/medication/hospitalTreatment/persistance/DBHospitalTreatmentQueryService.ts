import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import HospitalTreatmentQueryService, { HospitalTreatmentReadModel } from "../HospitalTreatmentQueryService";

export class DBHospitalTreatmentQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBHospitalTreatmentQueryService] Error - ${message}`);
    }
}

export default class DBHospitalTreatmentQueryService extends KnexConnector implements HospitalTreatmentQueryService {
    async treatment(id: Guid): Promise<HospitalTreatmentReadModel> {
        try {
            const treatment = await this.knex("hospital_treatment_view").where({ id: id.toString() })
            if (treatment.length === 0) throw new Error(`Not found treatment with provided id. Id: "${id.toString()}"`)
            const therapies = await this.knex("hospital_treatment_therapies_view").where({ hospital_treatment: treatment[0].id })
            return this.toTreatment(treatment[0], therapies)
        } catch (error) {
            throw new DBHospitalTreatmentQueryServiceError(`[treatment] - ${error.message}`);
        }

    }
    async treatments(medicalCardId: Guid): Promise<HospitalTreatmentReadModel[]> {
        try {
            const treatments = await this.knex("hospital_treatment_view").where({ medical_card: medicalCardId.toString() })
            const therapies = await this.knex("hospital_treatment_therapies_view").whereIn("hospital_treatment", treatments.map(t => t.id))
            return treatments.map(treatment => this.toTreatment(treatment, therapies.filter(t => t.hospital_treatment === treatment.id)))
        } catch (error) {
            throw new DBHospitalTreatmentQueryServiceError(`[treatments] - ${error.message}`);
        }
    }

    private toTreatment(data: any, treatments: any[]): HospitalTreatmentReadModel {
        return {
            id: data.id,
            patient: data.patient,
            therapies: treatments.map(t => ({ therapyId: t.therapy, label: t.label !== null ? t.label : undefined, createdAt: t.created_at })),
            closed: data.closed !== null ? data.closed : false,
            createdAt: data.created_at,
            closedAt: data.closed_at !== null ? data.closed_at : undefined
        }
    }
}