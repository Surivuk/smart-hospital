import { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    return knex.schema.raw(`CREATE VIEW hospital_treatment_therapies_view AS 
        SELECT 
            ht.*,
            t.label as label
        FROM hospital_treatment_therapies as ht
        LEFT JOIN therapy as t ON ht.therapy = t.id
    `)
}
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropViewIfExists("hospital_treatment_therapies_view")
}