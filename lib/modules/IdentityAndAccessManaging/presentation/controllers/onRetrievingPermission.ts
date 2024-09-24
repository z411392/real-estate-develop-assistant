import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type Permission } from "~/lib/modules/IdentityAndAccessManaging/dtos/Permission"

export const onRetrievingPermission = async (tenantId: string, permissionId: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/permissions/:permissionId`
            .replace(":tenantId", tenantId)
            .replace(":permissionId", permissionId)
        const {
            data: {
                payload: { permission },
            },
        } = await axios.get<{ payload: { permission: Permission } }>(uri)
        return permission
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return undefined
    }
}
