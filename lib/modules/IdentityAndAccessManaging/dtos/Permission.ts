import { type PermissionStatuses } from "~/lib/modules/IdentityAndAccessManaging/dtos/PermissionStatuses"
import { type Roles } from "~/lib/modules/IdentityAndAccessManaging/dtos/Roles"

export type Permission = {
    id: string
    tenantId: string
    userId: string
    status: PermissionStatuses
    role: Roles
    createdAt: number
    updatedAt: number
}
