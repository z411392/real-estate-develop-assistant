import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"

import { type LandDescriptor } from "~/lib/modules/OpenDataManaging/dtos/LandDescriptor"

export const onRetrievingLands = async (tenantId: string, ...landDescriptors: LandDescriptor[]) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    const { lands } = await realEstateDevelopAssistantService.retrieveLands(tenantId, ...landDescriptors)
    return lands
}
