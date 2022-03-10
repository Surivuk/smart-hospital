import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("hospital_treatment", (table) => {
        table.string("id").nullable().primary();
        table.string("medical_card").index().references("id").inTable("medical_card").onUpdate("CASCADE").onDelete("CASCADE");
        table.boolean("closed").nullable();
        table.timestamp("created_at").notNullable();
        table.timestamp("closed_at").nullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("hospital_treatment")
}