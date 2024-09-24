import { type RegistryFragmentStatuses } from "~/lib/modules/RegistryManaging/dtos/RegistryFragmentStatuses"

export type RegistryFragmentParsed = {
    registryId: string
    fragmentIndex: number
    registryFragmentStatus: RegistryFragmentStatuses
}
