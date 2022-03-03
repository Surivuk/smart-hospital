export interface MqttMessageHandler {
    (topic: string, data: any): Promise<void>
}

export default class MqttReceiver {
    private readonly _handlers: Map<string, MqttMessageHandler> = new Map();
    get handlers() {
        return this._handlers;
    }
    on(topic: string, handler: MqttMessageHandler): this {
        this._handlers.set(topic, handler);
        return this
    }

}