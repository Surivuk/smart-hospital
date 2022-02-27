import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("medical_card", (table) => {
        table.string("id").primary();
        table.timestamp("created_at").notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("medical_card")
}

