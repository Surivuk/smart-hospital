import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.withSchema("administration").createTable("patient", (table) => {
        table.string("id").primary();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.integer("birth_year").notNullable();
        table.string("gender").notNullable();
        table.timestamp("created_at").notNullable();
        table.timestamp("modified_at").nullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema("administration").dropTableIfExists("patient")
}

