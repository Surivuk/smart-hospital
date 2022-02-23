import { ChainCommand } from "@app/CommandChain";
import NotEmptyStringField from "@common/fields/NotEmptyStringField";
import Guid from "@common/Guid";

export default class AddExample implements ChainCommand {
    constructor(public readonly id: Guid, public readonly name: NotEmptyStringField) { }
}