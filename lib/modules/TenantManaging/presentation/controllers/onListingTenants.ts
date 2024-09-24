import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type Tenant } from "~/lib/modules/TenantManaging/dtos/Tenant"

export const onListingTenants = async (page: number) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants`
        const params = { page }
        const {
            data: {
                payload: { tenants },
            },
        } = await axios.get<{ payload: { tenants: Tenant[] } }>(uri, { params })
        return tenants
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return []
    }
}
