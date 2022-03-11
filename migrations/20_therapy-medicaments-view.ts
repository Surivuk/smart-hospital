import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.raw(`CREATE VIEW therapy_medicaments_view AS 
        SELECT 
            tm.*,
            m.name as medicament_name
        FROM therapy_medicaments as tm
        LEFT JOIN medicaments as m ON tm.medicament_id = m.id
    `)
}
export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropViewIfExists("therapy_medicaments_view")
}