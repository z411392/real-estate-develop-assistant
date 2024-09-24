import { type RegistryStatuses } from "~/lib/modules/RegistryManaging/dtos/RegistryStatuses"
import { type 建物謄本 } from "~/lib/modules/RegistryManaging/dtos/建物謄本"
import { type SnapshotTypes } from "~/lib/modules/SnapshotManaging/dtos/SnapshotTypes"
import { type 土地謄本 } from "~/lib/modules/RegistryManaging/dtos/土地謄本"

export type Registry = {
    id: string
    index: number
    type: SnapshotTypes
    text: string
    pending: number
    total: number
    processed: number
    status: RegistryStatuses
    metadata?: 建物謄本 | 土地謄本
}
