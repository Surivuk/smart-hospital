import BaseConfig from "./BasicConfig";

export interface WebConfig {
    port: number;
}
export interface ConfigData {
    web: WebConfig,
}

export default class Config extends BaseConfig {
    public readonly config: ConfigData;
    constructor(env: any) {
        super();
        this.config = this.parseConfig(env)
    }
    protected parseConfig(env: any): ConfigData {
        return {
            web: {
                port: this.convertToNumber("PORT", env.PORT)
            }
        }
    }
}