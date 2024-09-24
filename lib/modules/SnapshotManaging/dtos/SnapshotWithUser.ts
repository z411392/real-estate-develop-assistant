import { type Snapshot } from "~/lib/modules/SnapshotManaging/dtos/Snapshot"
import { type User } from "~/lib/modules/IdentityAndAccessManaging/dtos/User"

export type SnapshotWithUser = Omit<Snapshot, "userId"> & { user: User }
