import CommandChain from "@app/CommandChain";
import { ProcessHealthData } from "@app/commands/MonitoringCommands";
import Guid from "@common/Guid";

export default class MonitoringController {

    constructor(private readonly _commandChain: CommandChain) { }

    async processData(topic: string, { type, timestamp, value }: any) {
        // console.log(topic, type, timestamp, value)
        const defined = (value: string) => value !== undefined && value !== null
        const monitoringId = Guid.create(topic.split("/")[1])
        if (!defined(type)) throw new Error(`[MonitoringController] - Type is undefined`)
        if (!defined(timestamp)) throw new Error(`[MonitoringController] - Timestamp is undefined`)
        if (!defined(value)) throw new Error(`[MonitoringController] - Type is undefined`)
        if (isNaN(parseInt(timestamp))) throw new Error(`[MonitoringController] - Timestamp is not valid format`)
        await this._commandChain.process(new ProcessHealthData(monitoringId, { type, timestamp, value }))
    }
}