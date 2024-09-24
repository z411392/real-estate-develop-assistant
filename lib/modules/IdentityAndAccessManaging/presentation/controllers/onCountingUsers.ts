import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"

export const onCountingUsers = async (tenantId: string) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    const total = await realEstateDevelopAssistantService.countUsers(tenantId)
    return total
}
