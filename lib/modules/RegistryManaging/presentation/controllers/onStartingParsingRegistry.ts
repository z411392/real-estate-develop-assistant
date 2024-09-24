import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"

export const onStartingParsingRegistry = async (tenantId: string, snapshotId: string, registryId: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/snapshots/:snapshotId/registries/:registryId`
            .replace(":tenantId", tenantId)
            .replace(":snapshotId", snapshotId)
            .replace(":registryId", registryId)
        const {
            data: {
                payload: { toBeDedcuted },
            },
        } = await axios.put<{ payload: { toBeDedcuted: number } }>(uri)
        return toBeDedcuted
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return 0
    }
}
