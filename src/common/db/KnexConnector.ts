import knex, { Knex } from "knex";
import knexFile from "@app/../knexfile"

export default class KnexConnector {

    protected readonly knex: Knex;

    constructor() {
        const { pool, migrations, ...config } = (knexFile as any)[process.env.NODE_ENV as string];
        this.knex = knex(config)
    }

}