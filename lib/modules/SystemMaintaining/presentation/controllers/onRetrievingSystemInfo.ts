import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type SystemInfo } from "~/lib/modules/SystemMaintaining/dtos/SystemInfo"

export const onRetrievingSystemInfo = async () => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = "/system/info"
        const {
            data: { payload },
        } = await axios.get<{ payload: { systemInfo: SystemInfo } }>(uri)
        return payload
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return undefined
    }
}
