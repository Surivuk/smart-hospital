import { ChainCommand } from "@app/CommandChain";
import StringField from "@common/fields/StringField";
import Guid from "@common/Guid";
import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";

export class CreateExamination implements ChainCommand {
    constructor(public readonly medicalCardId: Guid, public readonly examinationId: Guid, public readonly doctorId: Guid, public readonly diagnose: StringField) { }
}
export class PrescribeTherapy implements ChainCommand {
    constructor(public readonly medicalCardId: Guid, public readonly therapyId: Guid, public readonly medicaments: MedicamentConsumption[]) { }
}
export class DetermineTherapy implements ChainCommand {
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid, public readonly medicaments: MedicamentConsumption[]) { }
}
export class OpenHospitalTreatment implements ChainCommand {
    constructor(public readonly medicalCardId: Guid, public readonly treatmentId: Guid) { }
}
// export class AddTherapyToTreatment implements ChainCommand {
//     constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid) { }
// }