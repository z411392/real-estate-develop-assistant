import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"

export const onCountingUsers = async (tenantId: string) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/users`.replace(":tenantId", tenantId)
        const response = await axios.head(uri)
        const total = parseInt(response.headers["content-length"])
        return total
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return 0
    }
}
