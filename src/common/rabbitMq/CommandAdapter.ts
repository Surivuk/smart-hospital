import { ChainCommand } from "@app/CommandChain";
import AddExample from "@app/commands/Commands";
import { HealthDataReceived } from "@events/MonitoringEvents";
import NotEmptyStringField from "@common/fields/NotEmptyStringField";
import Guid from "@common/Guid";
import AddPatient from "@app/commands/AdministrationCommands";
import Name from "@adminstration/Name";
import Gender from "@adminstration/Gender";
import NormalNumberField from "@common/fields/NormalNumberField";

interface CommandSerializer<T extends ChainCommand> {
    (event: T): any
}
interface CommandDeserializer<T extends ChainCommand> {
    (data: any): T
}

export class CommandAdapterError extends Error {
    constructor(message: string) {
        super(`[CommandAdapter] Error - ${message}`);
    }
}

export default class CommandAdapter {

    private readonly _serializer: { [key: string]: CommandSerializer<any> } = {
        [AddPatient.name]: ({ name, gender, birthYear }: AddPatient) => ({
            firstName: name.firstName,
            lastName: name.lastName,
            gender: gender.toString(),
            birthYear: birthYear.value()
        })
    }
    private readonly _deserializer: { [key: string]: CommandDeserializer<any> } = {
        [AddPatient.name]: ({ firstName, lastName, gender, birthYear }) =>
            new AddPatient(Name.create(firstName, lastName), Gender.create(gender), NormalNumberField.create(birthYear))
    }


    serialize(command: ChainCommand) {
        const serializer = this._serializer[command.constructor.name]
        if (serializer === undefined)
            throw new CommandAdapterError(`Not found serializer for provided command. Command name: "${command.constructor.name}"`)
        return serializer(command);
    }
    deserialize(commandName: string, data: any) {
        const deserializer = this._deserializer[commandName]
        if (deserializer === undefined)
            throw new CommandAdapterError(`Not found deserializer for provided data. Command name: "${commandName}"`)
        return deserializer(data);
    }
}