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
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid, public readonly treatmentLabel: StringField, public readonly medicaments: MedicamentConsumption[]) { }
}
export class OpenHospitalTreatment implements ChainCommand {
    constructor(public readonly medicalCardId: Guid, public readonly treatmentId: Guid) { }
}
export class AddMedicamentToTherapy implements ChainCommand {
    constructor(public readonly therapyId: Guid, public readonly medicament: MedicamentConsumption) { }
}
export class RemoveMedicamentFromTherapy implements ChainCommand {
    constructor(public readonly therapyId: Guid, public readonly medicamentId: Guid) { }
}
export class ChangeTherapyLabel implements ChainCommand {
    constructor(public readonly therapyId: Guid, public readonly label: StringField) { }
}
export class RemoveTherapyFromTreatment implements ChainCommand {
    constructor(public readonly therapyId: Guid, public readonly treatmentId: Guid) { }
}
export class CloseHospitalTreatment implements ChainCommand {
    constructor(public readonly treatmentId: Guid) { }
}