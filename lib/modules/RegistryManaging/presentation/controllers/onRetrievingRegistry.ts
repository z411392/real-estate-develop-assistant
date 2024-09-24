import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"

export const onRetrievingRegistry = async (tenantId: string, snapshotId: string, registryId: string) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    const { registry } = await realEstateDevelopAssistantService.retrieveRegistry(tenantId, snapshotId, registryId)
    return registry
}
