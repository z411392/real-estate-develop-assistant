import { type SnapshotTypes } from "~/lib/modules/SnapshotManaging/dtos/SnapshotTypes"

export type Snapshot = {
    id: string
    name: string
    downloadURL: string
    type: SnapshotTypes
    userId: string
    createdAt: number
    updatedAt: number
}
