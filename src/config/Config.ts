import BaseConfig from "./BasicConfig";


export interface ConfigData {
    port: number,
    mqtt: string,
    rabbitMq: string
    eventStore: string
}

export default class Config extends BaseConfig {
    public readonly config: ConfigData;
    constructor(env: any) {
        super();
        this.config = this.parseConfig(env)
    }
    protected parseConfig(env: any): ConfigData {
        return {
            port: this.convertToNumber("PORT", env.PORT),
            eventStore: this.convertToString("EVENT_STORE_URL", env.EVENT_STORE_URL),
            mqtt: this.convertToString("MQTT_URL", env.MQTT_URL),
            rabbitMq: this.convertToString("RABBIT_MQ_URL", env.RABBIT_MQ_URL)
        }
    }
}