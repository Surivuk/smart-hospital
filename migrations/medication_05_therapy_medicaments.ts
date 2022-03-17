import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.withSchema("medication").createTable("therapy_medicaments", (table) => {
        table.string("therapy").notNullable().index().references("id").inTable("medication.therapy").onUpdate("CASCADE").onDelete("CASCADE");
        table.string("medicament_id").notNullable().index().references("id").inTable("medication.medicaments").onUpdate("CASCADE").onDelete("CASCADE");
        table.integer("strength").notNullable();
        table.integer("amount").notNullable();
        table.string("route").notNullable();
        table.string("frequency").notNullable();
        table.timestamp("created_at").notNullable();
        table.unique(["therapy", "medicament_id"])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema("medication").dropTableIfExists("therapy_medicaments")
}