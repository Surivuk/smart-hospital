import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.withSchema("medication").createTable("hospital_treatment", (table) => {
        table.string("id").nullable().primary();
        table.string("diagnosis", 1000).notNullable();
        table.boolean("closed").nullable();
        table.timestamp("created_at").notNullable();
        table.timestamp("closed_at").nullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema("medication").dropTableIfExists("hospital_treatment")
}