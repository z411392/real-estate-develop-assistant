import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"
import { showError, showSuccess } from "~/composables/utils/useSnackbar"

export const onUploadingSnapshot = async (tenantId: string, name: string, content: string) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    try {
        const { snapshotId } = await realEstateDevelopAssistantService.uploadSnapshot(tenantId, name, content)
        showSuccess(`謄本已成功上傳`)
        return snapshotId
    } catch (error) {
        showError((error as Error).message)
    }
}
