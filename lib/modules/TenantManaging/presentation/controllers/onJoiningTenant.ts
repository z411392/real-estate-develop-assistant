import { translateError } from "~/lib/utils/formatters"
import { showError, showSuccess } from "~/composables/utils/useSnackbar"

export const onJoiningTenant = async (tenantId: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/permissions`.replace(":tenantId", tenantId)
        const data = {}
        const {
            data: { payload: _ },
        } = await axios.post<{ payload: { permissionId: string } }>(uri, data)
        showSuccess(`已提出加入團隊的申請`)
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
    }
}
