import mqtt, { Client } from "mqtt"
import MqttReceiver, { MqttMessageHandler } from "./MqttReceiver";


export default class MqttConnection {

    private readonly _client: Client;

    constructor(brokerUrl: string) {
        this._client = mqtt.connect(brokerUrl, { username: "smart-hospital", password: "admin" })
    }

    async subscribe(topic: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._client.subscribe(topic, (err) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve()
            })
        })
    }
    async public(topic: string, data: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this._client.publish(topic, JSON.stringify(data), (err) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve()
            })
        })
    }
    async start(receivers: MqttReceiver[]) {
        const handlers: Map<string, MqttMessageHandler> = new Map<string, MqttMessageHandler>()
        receivers.forEach((listener) => {
            listener.handlers.forEach((handler, key) => {
                handlers.set(key, handler)
            })
        })

        try {
            const subscriptions = Array.from(handlers.keys()).map(topic => this.subscribe(topic))
            await Promise.all(subscriptions);
        } catch (error) {
            throw error
        }

        this._client.on("message", async (topic, payload) => {
            const matchHandlers = this.findHandlers(handlers, topic)
            if (matchHandlers.length === undefined) return;
            try {
                await Promise.all(matchHandlers.map(handler => handler(topic, JSON.parse(payload.toString()))))
            } catch (error) {
                console.log(`[MQTT] - ${error.message}`)
            }
        })
    }

    private findHandlers(handlers: Map<string, MqttMessageHandler>, receivedTopic: string) {
        const result: MqttMessageHandler[] = []
        const keys = Array.from(handlers.keys()).map(topic => {
            if (topic.indexOf("+") !== -1)
                return { key: topic, regex: new RegExp(topic.replace("+", "([a-zA-Z0-9-]+)"), "g") }
            if (topic.endsWith("/#"))
                return { key: topic, regex: new RegExp(topic.replace("/#", "([/]*)([a-zA-Z0-9-/]*)"), "g") }
            return { key: topic, regex: topic }
        })

        const matchKeys = keys
            .filter(({ regex }) => {
                const match = receivedTopic.match(regex)
                return match === null ? false : match[0] === receivedTopic
            })
            .map(({ key }) => key)
        handlers.forEach((handler, key) => {
            if (matchKeys.indexOf(key) !== -1)
                result.push(handler)
        })
        return result;
    }
}