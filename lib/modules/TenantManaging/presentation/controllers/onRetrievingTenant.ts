import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type Tenant } from "~/lib/modules/TenantManaging/dtos/Tenant"
import { type Permission } from "~/lib/modules/IdentityAndAccessManaging/dtos/Permission"

export const onRetrievingTenant = async (tenantId: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId`.replace(":tenantId", tenantId)
        const {
            data: {
                payload: { tenant, permission },
            },
        } = await axios.get<{
            payload: {
                tenant: Tenant
                permission?: Permission
            }
        }>(uri)
        return {
            tenant,
            permission,
        }
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return undefined
    }
}
