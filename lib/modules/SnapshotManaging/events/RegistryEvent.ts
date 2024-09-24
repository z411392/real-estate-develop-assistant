import { type Event } from "~/lib/utils/events"
import { RegistryEventTypes } from "~/lib/modules/SnapshotManaging/events/RegistryEventTypes"
import { type RegistryFragmentParsed } from "~/lib/modules/SnapshotManaging/events/RegistryFragmentParsed"

export type RegistryEvent<T = RegistryEventTypes> = Event<
    T,
    T extends RegistryEventTypes.RegistryFragmentParsed ? RegistryFragmentParsed : unknown
>
