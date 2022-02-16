import { ChainCommand } from "@app/CommandChain";
import AddExample from "@app/commands/Commands";
import { HealthDataReceived } from "@events/MonitoringEvents";
import NotEmptyStringField from "@helper/fields/NotEmptyStringField";
import Guid from "@helper/Guid";

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
        [AddExample.name]: ({ id, name }: AddExample) => ({
            id: id.toString(),
            name: name.toString(),
        })
    }
    private readonly _deserializer: { [key: string]: CommandDeserializer<any> } = {
        [AddExample.name]: ({ id, name }) => new AddExample(new Guid(id), NotEmptyStringField.create(name))
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