import { RealEstateDevelopAssistantService } from "~/lib/adapters/http/RealEstateDevelopAssistantService"

import { type PermissionStatuses } from "~/lib/modules/IdentityAndAccessManaging/dtos/PermissionStatuses"

export const onReviewingJoining = async (tenantId: string, permissionId: string, status: PermissionStatuses) => {
    const {
        public: { apiBaseURL },
    } = useRuntimeConfig()
    const { $idToken } = useNuxtApp()
    const realEstateDevelopAssistantService = new RealEstateDevelopAssistantService({
        baseURL: apiBaseURL,
        idToken: $idToken.value,
    })
    await realEstateDevelopAssistantService.reviewJoining(tenantId, permissionId, status)
    return permissionId
}
