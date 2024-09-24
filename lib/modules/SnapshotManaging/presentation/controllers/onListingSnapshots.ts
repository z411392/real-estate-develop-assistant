import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"

import { type SnapshotWithUser } from "~/lib/modules/SnapshotManaging/dtos/SnapshotWithUser"
import { type Snapshot } from "~/lib/modules/SnapshotManaging/dtos/Snapshot"
import { type User } from "~/lib/modules/IdentityAndAccessManaging/dtos/User"

export const onListingSnapshots = async (tenantId: string, page: number) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    const {
        snapshots,
        usersMap,
    }: {
        snapshots: Snapshot[]
        usersMap: {
            [userId: string]: User
        }
    } = await realEstateDevelopAssistantService.listSnapshots(tenantId, page)
    return snapshots.map(({ userId, ...snapshot }) => {
        const user = usersMap[userId]
        const snapshotWithUser: SnapshotWithUser = {
            ...snapshot,
            user,
        }
        return snapshotWithUser
    })
}
