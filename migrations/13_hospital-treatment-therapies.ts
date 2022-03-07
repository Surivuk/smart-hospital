import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("hospital_treatment_therapies", (table) => {
        table.string("hospital_treatment").notNullable().index().references("id").inTable("hospital_treatment").onUpdate("CASCADE").onDelete("CASCADE");
        table.string("therapy").notNullable().index().references("id").inTable("therapy").onUpdate("CASCADE").onDelete("CASCADE");
        table.timestamp("created_at").notNullable();
        table.unique(["hospital_treatment", "therapy"])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("hospital_treatment_therapies")
}