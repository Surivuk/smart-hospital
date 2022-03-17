import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createSchemaIfNotExists("administration")
    await knex.schema.createSchemaIfNotExists("medication")
    await knex.schema.createSchemaIfNotExists("alarming")
    await knex.schema.createSchemaIfNotExists("monitoring")
    await knex.schema.createSchemaIfNotExists("health_center")
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropSchemaIfExists("administration")
    await knex.schema.dropSchemaIfExists("medication")
    await knex.schema.dropSchemaIfExists("alarming")
    await knex.schema.dropSchemaIfExists("monitoring")
    await knex.schema.dropSchemaIfExists("health_center")
}

