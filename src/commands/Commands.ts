import { ChainCommand } from "@app/CommandChain";
import NotEmptyStringField from "@helper/fields/NotEmptyStringField";
import Guid from "@helper/Guid";

export default class AddExample implements ChainCommand {
    constructor(public readonly id: Guid, public readonly name: NotEmptyStringField) { }
}