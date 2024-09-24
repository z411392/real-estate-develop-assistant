import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"
import { showError, showSuccess } from "~/composables/utils/useSnackbar"

export const onJoiningTenant = async (tenantId: string) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    try {
        const { permissionId } = await realEstateDevelopAssistantService.joinTenant(tenantId)
        showSuccess(`已提出加入團隊的申請`)
        return permissionId
    } catch (error) {
        showError((error as Error).message)
    }
}
