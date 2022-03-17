import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.withSchema("alarming").createTable("alarm", (table) => {
        table.string("id").nullable().primary();
        table.string("doctor").nullable();
        table.string("hospital_treatment").nullable();
        table.string("name").nullable();
        table.boolean("active").nullable().defaultTo(true);
        table.timestamp("created_at").notNullable();
        table.timestamp("changed_active_at").nullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema("alarming").dropTableIfExists("alarm")
}

