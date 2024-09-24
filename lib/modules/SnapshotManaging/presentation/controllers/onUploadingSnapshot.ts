import { translateError } from "~/lib/utils/formatters"
import { showError, showSuccess } from "~/composables/utils/useSnackbar"

export const onUploadingSnapshot = async (tenantId: string, name: string, content: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/snapshots`.replace(":tenantId", tenantId)
        const data = {
            name,
            content,
        }
        const {
            data: {
                payload: { snapshotId },
            },
        } = await axios.post<{ payload: { snapshotId: string } }>(uri, data, {
            headers: {
                "Content-Type": "application/octet-stream",
            },
        })
        showSuccess(`謄本 ${snapshotId} 已成功上傳`)
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
    }
}
