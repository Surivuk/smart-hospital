import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("health_data", (table) => {
        table.string("hospital_treatment").nullable();
        table.string("type").nullable();
        table.string("value").nullable();
        table.timestamp("timestamp").notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("health_data")
}

