import { initializeApp, cert } from "firebase-admin/app"

export default defineNitroPlugin((_) => {
    const credential = cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY!).replace(/\\n/gm, "\n"),
    })
    const databaseURL = process.env.FIREBASE_DATABASE_URL!
    initializeApp({
        credential,
        databaseURL,
    })
})