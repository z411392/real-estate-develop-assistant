import { translateError } from "~/lib/utils/formatters"
import { showError, showSuccess } from "~/composables/utils/useSnackbar"
import { PermissionStatuses } from "~/lib/modules/IdentityAndAccessManaging/dtos/PermissionStatuses"

export const onReviewingJoining = async (tenantId: string, permissionId: string, status: PermissionStatuses) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/permissions/:permissionId`
            .replace(":tenantId", tenantId)
            .replace(":permissionId", permissionId)
        const data = { status }
        const {
            data: { payload: _ },
        } = await axios.put<{ payload: { permissionId: string } }>(uri, data)
        if (status === PermissionStatuses.Approved) showSuccess(`批准了該申請`)
        if (status === PermissionStatuses.Rejected) showSuccess(`否決了該申請`)
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
    }
}
