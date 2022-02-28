import Gender from "@adminstration/Gender";
import Name from "@adminstration/Name";
import { ChainCommand } from "@app/CommandChain";
import NumberField from "@common/fields/NumberField";
import Guid from "@common/Guid";

export default class AddPatient implements ChainCommand {
    constructor(public readonly patientId: Guid, public readonly name: Name, public readonly gender: Gender, public readonly birthYear: NumberField) { }
}