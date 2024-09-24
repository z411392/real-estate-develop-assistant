import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"

export const onCountingRegistries = async (tenantId: string, snapshotId: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/snapshots/:snapshotId/registries`
            .replace(":tenantId", tenantId)
            .replace(":snapshotId", snapshotId)
        const response = await axios.head(uri)
        const total = parseInt(response.headers["content-length"])
        return total
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return 0
    }
}
