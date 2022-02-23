import Gender from "@adminstration/Gender";
import Name from "@adminstration/Name";
import { ChainCommand } from "@app/CommandChain";
import NumberField from "@common/fields/NumberField";

export default class AddPatient implements ChainCommand {
    constructor(public readonly name: Name, public readonly gender: Gender, public readonly birthYear: NumberField) { }
}