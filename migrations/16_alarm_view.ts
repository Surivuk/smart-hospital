import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.raw(`CREATE VIEW alarm_view AS 
        SELECT 
            a.*,
            ht.medical_card as medical_card
        FROM alarm as a
        LEFT JOIN hospital_treatment as ht ON a.hospital_treatment = ht.id
    `)
}
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropViewIfExists("alarm_view")
}