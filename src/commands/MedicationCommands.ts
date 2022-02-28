import { ChainCommand } from "@app/CommandChain";
import StringField from "@common/fields/StringField";
import Guid from "@common/Guid";

export default class CreateExamination implements ChainCommand {
    constructor(public readonly medicalCardId: Guid, public readonly examinationId: Guid, public readonly doctorId: Guid, public readonly diagnose: StringField) { }
}