import Guid from "@common/Guid";
import MqttListener from "@common/mqtt/MqttListener";
import MqttReceiver from "@common/mqtt/MqttReceiver";
import MonitoringController from "./MonitoringController";

export default class MonitoringListener implements MqttListener {

    constructor(private readonly _controller: MonitoringController) { }

    receiver(): MqttReceiver {
        return new MqttReceiver()
            .on("monitoring/+/data", async (topic, data) => this._controller.processData(topic, data))
    }
}