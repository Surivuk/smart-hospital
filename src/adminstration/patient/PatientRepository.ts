import Gender from "@adminstration/Gender";
import Name from "@adminstration/Name";
import NumberField from "@common/fields/NumberField";
import Guid from "@common/Guid";

export default interface PatientRepository {
    createPatient(id: Guid, name: Name, gender: Gender, birthDate: NumberField): Promise<void>;
}