import { watchCollection, WatchTypes } from "~/lib/utils/firestore"
import { type Event } from "~/lib/utils/events"
import { getFirestore, collection, query, where, orderBy, limit, Timestamp } from "@firebase/firestore"

type OnStarted = (path: string, now: number) => void | Promise<void>
type OnChanged<T> = (data: T, id: string) => void | Promise<void>

export const useEventListener = <T extends Event>(path: string, onStarted?: OnStarted, onlyNew: boolean = true) => {
    const listen = (onChanged: OnChanged<T>) => {
        const now = Timestamp.now()
        if (onStarted) onStarted(path, now.toMillis())
        let q: any = collection(getFirestore(), path)
        if (onlyNew) q = query(q,
            where("timestamp", ">=", now),
            orderBy("timestamp", "desc"),
            limit(1),
        )
        const unsubscribe = watchCollection<T>(q, (data, eventId) => onChanged(data, eventId), [WatchTypes.Added])
        return unsubscribe
    }
    return listen
}