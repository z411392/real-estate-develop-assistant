import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type Registry } from "~/lib/modules/RegistryManaging/dtos/Registry"

export const onRetrievingRegistry = async (tenantId: string, snapshotId: string, registryId: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/snapshots/:snapshotId/registries/:registryId`
            .replace(":tenantId", tenantId)
            .replace(":snapshotId", snapshotId)
            .replace(":registryId", registryId)
        const {
            data: {
                payload: { registry },
            },
        } = await axios.get<{ payload: { registry: Registry } }>(uri)
        return registry
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return undefined
    }
}
