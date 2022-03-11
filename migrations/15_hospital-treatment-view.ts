import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.raw(`CREATE VIEW hospital_treatment_view AS 
        SELECT 
            ht.*,
            CONCAT (p.first_name, ' ', p.last_name, ' (', p.birth_year, ')' ) as patient,
            m.id as monitoring
        FROM hospital_treatment as ht
        LEFT JOIN patient as p ON ht.medical_card = p.id
        LEFT JOIN monitoring_device as m ON ht.id = m.hospital_treatment
    `)
}
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropViewIfExists("hospital_treatment_view")
}