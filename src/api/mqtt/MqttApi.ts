import { Dependency } from "@app/dependency/DependencyContainer";
import MonitoringController from "./monitoring/MonitoringController";
import MonitoringListener from "./monitoring/MonitoringListener";

export default class MqttApi {
    constructor(private readonly _dependency: Dependency) {}

    async start() {
        await this._dependency.mqtt.start([
            new MonitoringListener(new MonitoringController(this._dependency.commandChain)).receiver()
        ])
        console.log("[MQTT API] Started")
    }
}