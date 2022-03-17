import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.withSchema("medication").createTable("examination", (table) => {
        table.string("id").nullable().primary();
        table.string("diagnosis", 1000).notNullable()
        table.timestamp("created_at").notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema("medication").dropTableIfExists("examination")
}