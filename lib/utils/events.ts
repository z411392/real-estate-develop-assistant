import { type Timestamp } from "@firebase/firestore"

export type Event<T = unknown, S = unknown> = {
    type: T
    data: S
    timestamp: Timestamp
}
