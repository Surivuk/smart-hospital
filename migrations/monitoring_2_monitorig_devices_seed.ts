import { Knex } from "knex";

const monitoringList = [
    "monitoring-device-1",
    "monitoring-device-2",
    "monitoring-device-3",
    "monitoring-device-4",
    "monitoring-device-5",
    "monitoring-device-6",
    "monitoring-device-7",
    "monitoring-device-8",
    "monitoring-device-9",
    "monitoring-device-10",
]

export async function up(knex: Knex): Promise<void> {
    for await (const id of monitoringList)
        await knex("monitoring.monitoring_device").insert({ id: id, created_at: knex.fn.now() })
}

export async function down(knex: Knex): Promise<void> {
    for await (const id of monitoringList)
        await knex("monitoring.monitoring_device").where({ id: id }).delete()
}

