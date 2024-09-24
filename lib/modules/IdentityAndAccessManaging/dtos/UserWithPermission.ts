import { type User } from "~/lib/modules/IdentityAndAccessManaging/dtos/User"
import { type Permission } from "~/lib/modules/IdentityAndAccessManaging/dtos/Permission"

export type UserWithPermission = User & {
    permission: Permission
}
