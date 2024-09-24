import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type Registry } from "~/lib/modules/RegistryManaging/dtos/Registry"

export const onListingRegistries = async (tenantId: string, snapshotId: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/snapshots/:snapshotId/registries`
            .replace(":tenantId", tenantId)
            .replace(":snapshotId", snapshotId)
        const {
            data: {
                payload: { registries },
            },
        } = await axios.get<{ payload: { registries: Registry[] } }>(uri)
        return registries
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return []
    }
}
