import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.withSchema("monitoring").createTable("monitoring_device", (table) => {
        table.string("id").notNullable();
        table.string("hospital_treatment").nullable();
        table.timestamp("created_at").notNullable();
        table.timestamp("modified_at").nullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema("monitoring").dropTableIfExists("monitoring_device")
}

