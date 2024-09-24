import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"

export const onRetrievingPermission = async (tenantId: string, permissionId: string) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    const { permission } = await realEstateDevelopAssistantService.retrievePermission(tenantId, permissionId)
    return permission
}
