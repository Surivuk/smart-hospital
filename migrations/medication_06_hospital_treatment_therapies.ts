import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.withSchema("medication").createTable("hospital_treatment_therapies", (table) => {
        table.string("hospital_treatment").notNullable().index().references("id").inTable("medication.hospital_treatment").onUpdate("CASCADE").onDelete("CASCADE");
        table.string("therapy").notNullable().index().references("id").inTable("medication.therapy").onUpdate("CASCADE").onDelete("CASCADE");
        table.timestamp("created_at").notNullable();
        table.unique(["hospital_treatment", "therapy"])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.withSchema("medication").dropTableIfExists("hospital_treatment_therapies")
}