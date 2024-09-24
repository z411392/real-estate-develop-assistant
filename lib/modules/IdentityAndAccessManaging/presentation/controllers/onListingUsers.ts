import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type User } from "~/lib/modules/IdentityAndAccessManaging/dtos/User"
import { type Permission } from "~/lib/modules/IdentityAndAccessManaging/dtos/Permission"

export type UserWithPermission = User & {
    permission: Permission
}

export const onListingUsers = async (tenantId: string, page: number) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/users`.replace(":tenantId", tenantId)
        const params = { page }
        const {
            data: {
                payload: { users },
            },
        } = await axios.get<{ payload: { users: UserWithPermission[] } }>(uri, { params })
        return users
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return []
    }
}
