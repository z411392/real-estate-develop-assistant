import { translateError } from "~/lib/utils/formatters"
import { showError } from "~/composables/utils/useSnackbar"
import { type Land } from "~/lib/modules/OpenDataManaging/dtos/Land"

export type LandDescriptor = {
    city: string
    administrativeDistrict: string
    section: string
    subsection: string
    parentLotNumber: string
    subLotNumber: string
}

export const onRetrievingLands = async (tenantId: string, ...landDescriptors: LandDescriptor[]) => {
    const axios = unref(useNuxtApp().$axios)
    try {
        const uri = `/tenants/:tenantId/lands`.replace(":tenantId", tenantId)
        const data = { landDescriptors }
        const {
            data: {
                payload: { lands },
            },
        } = await axios.post<{ payload: { lands: Land[] } }>(uri, data)
        return lands
    } catch (throwable) {
        const error = translateError(throwable)
        if (error) showError(error.message)
        return []
    }
}
