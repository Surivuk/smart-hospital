import { Knex } from "knex";

const medicaments = [
    { id: "enalapril", name: "Enalapril" },
    { id: "losartan", name: "Losartan" },
    { id: "furosemid", name: "Furosemid" },
    { id: "glimepiride", name: "Glimepiride" },
    { id: "metformin", name: "Metformin" },
    { id: "bisoprolol", name: "Bisoprolol" },
    { id: "bromazepam", name: "Bromazepam" }
]

export async function up(knex: Knex): Promise<void> {
    for await (const { id, name } of medicaments)
        await knex("medication.medicaments").insert({ id: id, name: name, created_at: knex.fn.now() })
}

export async function down(knex: Knex): Promise<void> {
    for await (const { id } of medicaments)
        await knex("medication.medicaments").where({ id: id }).delete()
}
