import { onSnapshot, type QuerySnapshot, type DocumentData } from "@firebase/firestore"

export enum WatchTypes {
    Added = "added",
    Modified = "modified",
    Removed = "removed",
}

type Callable<T> = (data: T, id: string) => void | Promise<void>

export const watchCollection = <T = any>(
    query: any,
    callable: Callable<T>,
    types: string[] = [WatchTypes.Added, WatchTypes.Modified, WatchTypes.Removed],
) => {
    const unsubscribe = onSnapshot(query, async (querySnapshot: QuerySnapshot<DocumentData, DocumentData>) => {
        querySnapshot.docChanges().forEach(async (change) => {
            if (!types.includes(change.type)) return
            try {
                await callable(change.doc.data() as T, change.doc.id)
            } catch {}
        })
    })
    return unsubscribe
}
