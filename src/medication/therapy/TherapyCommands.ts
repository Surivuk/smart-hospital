import { ChainCommand } from "@app/CommandChain";
import MedicamentConsumption from "@medication/medicamentConsumtion/MedicamentConsumption";
import Guid from "@helper/Guid";

export class CreateTherapy implements ChainCommand {
    constructor(public readonly therapyID: Guid, public readonly medications: MedicamentConsumption[]) { }
}
export class AddMedicationToTherapy implements ChainCommand {
    constructor(public readonly therapyId: Guid, public readonly medication: MedicamentConsumption) { }
}
export class RemoveMedicationFromTherapy implements ChainCommand {
    constructor(public readonly therapyId: Guid, public readonly medicationId: Guid) { }
}