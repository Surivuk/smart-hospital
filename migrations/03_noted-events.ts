import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("noted_events", (table) => {
        table.string("type").notNullable();
        table.string("event_id").notNullable();
        table.string("medical_card").index().references("id").inTable("medical_card").onUpdate("CASCADE").onDelete("CASCADE");
        table.timestamp("created_at").notNullable();
        table.unique(["medical_card", "event_id"]);
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("noted_events")
}

