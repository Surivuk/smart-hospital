import { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    return knex.schema.raw(`CREATE VIEW medication.hospital_treatment_therapies_view AS 
        SELECT 
            ht.*,
            t.label as label
        FROM medication.hospital_treatment_therapies as ht
        LEFT JOIN medication.therapy as t ON ht.therapy = t.id
    `)
}
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropViewIfExists("medication.hospital_treatment_therapies_view")
}