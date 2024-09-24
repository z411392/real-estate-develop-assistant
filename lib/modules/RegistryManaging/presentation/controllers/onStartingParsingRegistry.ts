import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"
import { showError } from "~/composables/utils/useSnackbar"

export const onStartingParsingRegistry = async (tenantId: string, snapshotId: string, registryId: string) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    try {
        const { toBeDedcuted } = await realEstateDevelopAssistantService.parseRegistry(tenantId, snapshotId, registryId)
        return toBeDedcuted
    } catch (error) {
        showError((error as Error).message)
        return 0
    }
}
