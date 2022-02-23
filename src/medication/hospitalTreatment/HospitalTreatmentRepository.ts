import Guid from "@common/Guid";
import HospitalTreatment from "./HospitalTreatment";

export default interface HospitalTreatmentRepository {
    treatment(treatmentId: Guid): Promise<HospitalTreatment>;
    save(treatment: HospitalTreatment): Promise<void>;
}