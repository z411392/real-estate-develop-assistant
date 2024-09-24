import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"

export const onListingTenants = async (page: number) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    const { tenants } = await realEstateDevelopAssistantService.listTenants(page)
    return tenants
}
