import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type Snapshot } from "~/lib/modules/SnapshotManaging/dtos/Snapshot"
import { type User } from "~/lib/modules/IdentityAndAccessManaging/dtos/User"

export type SnapshotWithUser = Omit<Snapshot, "userId"> & { user: User }

export const onListingSnapshots = async (tenantId: string, page: number) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/snapshots`.replace(":tenantId", tenantId)
        const params = { page }
        const {
            data: {
                payload: { snapshots, usersMap },
            },
        } = await axios.get<{ payload: { snapshots: Snapshot[]; usersMap: { [userId: string]: User } } }>(uri, {
            params,
        })
        return snapshots.map(({ userId, ...snapshot }) => {
            const user = usersMap[userId]
            const snapshotWithUser: SnapshotWithUser = {
                ...snapshot,
                user,
            }
            return snapshotWithUser
        })
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return []
    }
}
