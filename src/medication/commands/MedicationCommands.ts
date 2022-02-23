import { ChainCommand } from "@app/CommandChain";
import Guid from "@common/Guid";

export class CreateHospitalTreatment implements ChainCommand {
    constructor(public readonly medicalCardId: Guid, public readonly doctorId: Guid) { }
}
export class AddTherapyToTreatment implements ChainCommand {
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid) { }
}