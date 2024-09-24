import { getAuth } from "firebase/auth"
import { withRedirectTo } from "~/lib/utils/sessions"

export const withEnsuringUserSignedOut = async () => {
    const auth = getAuth()
    if (!auth.currentUser) return
    const redirectTo = withRedirectTo(true)
    return redirectTo.value
}
