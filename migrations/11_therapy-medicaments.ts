import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("therapy_medicaments", (table) => {
        table.string("therapy").index().references("id").inTable("therapy").onUpdate("CASCADE").onDelete("CASCADE");
        table.string("medicament_id").notNullable();
        table.integer("strength").notNullable();
        table.integer("amount").notNullable();
        table.string("route").notNullable();
        table.string("frequency").notNullable();
        table.timestamp("created_at").notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("therapy_medicaments")
}