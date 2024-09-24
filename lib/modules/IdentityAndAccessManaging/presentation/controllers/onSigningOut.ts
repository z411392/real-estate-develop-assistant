import { Pages } from "~/lib/constants"
import { getAuth, signOut } from "firebase/auth"

export const onSigningOut = async () => {
    try {
        const auth = getAuth()
        if (!auth.currentUser) return
        await signOut(auth)
    } finally {
        await navigateTo(Pages.SignIn.fullPath())
    }
}
