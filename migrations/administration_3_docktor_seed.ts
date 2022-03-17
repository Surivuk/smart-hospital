import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex("administration.doctor").insert({
        id: "e931a246-e339-4bdf-8906-b18370293948",
        first_name: "John",
        last_name: "Doe",
        gender: "male",
        created_at: knex.fn.now()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex("administration.doctor").where({ id: "e931a246-e339-4bdf-8906-b18370293948" }).delete()
}

