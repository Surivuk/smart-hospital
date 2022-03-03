import { Knex } from "knex";

const monitoringList = [
    "fd3ffa4c-5171-4fe8-a7bf-1bf589bc5f8f",
    "4b658f61-bc43-4226-b717-a9967a6e4da5",
    "c4576aa1-0a79-44db-baa1-8e0421721c89",
    "753455c2-2cc3-4d59-877c-f28a9e45f930",
    "cb43051f-85cd-4a34-a10d-e6afe867d019",
    "3fbabffd-3a0a-4325-9483-a8bf2801f33f",
    "7347ef00-2dc1-4062-b6e3-232404579466",
    "96f4271f-3c21-4b89-90dd-bb6f40f404fc",
    "f18b3255-914a-451e-bc8e-f6a30d3a70fd",
    "c43d2cde-0c6f-43ef-9af1-3d79c43085e2",
]

export async function up(knex: Knex): Promise<void> {
    for await (const id of monitoringList)
        await knex("monitoring_device").insert({ id: id, created_at: knex.fn.now() })
}

export async function down(knex: Knex): Promise<void> {
    for await (const id of monitoringList)
        await knex("monitoring_device").where({ id: id }).delete()
}

