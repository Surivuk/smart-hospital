import { ChainCommand } from "@app/CommandChain";
import MedicationConsumption from "@app/medication/MedicationConsumption";
import Guid from "@helper/Guid";

export class CreateTherapy implements ChainCommand {
    constructor(public readonly therapyID: Guid, public readonly medications: MedicationConsumption[]) { }
}
export class AddMedicationToTherapy implements ChainCommand {
    constructor(public readonly therapyId: Guid, public readonly medication: MedicationConsumption) { }
}
export class RemoveMedicationFromTherapy implements ChainCommand {
    constructor(public readonly therapyId: Guid, public readonly medicationId: Guid) { }
}