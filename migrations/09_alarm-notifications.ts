import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("alarm_notifications", (table) => {
        table.string("alarm").index().references("id").inTable("alarm").onUpdate("CASCADE").onDelete("CASCADE");
        table.string("data_type").nullable();
        table.string("data_value").nullable();
        table.timestamp("created_at").notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("alarm_notifications")
}