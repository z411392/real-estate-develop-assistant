import { getAuth } from "firebase/auth"
import { type RouteLocationNormalizedGeneric } from "vue-router"
import { Pages } from "~/lib/constants"
import { withRedirectTo } from "~/lib/utils/sessions"

export const withEnsuringUserSignedIn = async (to: RouteLocationNormalizedGeneric) => {
    const auth = getAuth()
    if (auth.currentUser) return
    const redirectTo = withRedirectTo()
    redirectTo.value = to.fullPath
    return Pages.SignIn.fullPath()
}
