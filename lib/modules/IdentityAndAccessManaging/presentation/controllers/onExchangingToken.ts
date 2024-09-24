import { type H3Event } from "h3"
import { SignIn } from "~/lib/modules/IdentityAndAccessManaging/application/mutations/SignIn"
import { getAuth } from "firebase-admin/auth"

export const onExchangingToken = async (event: H3Event) => {
    const auth = getAuth()
    const protocol = getRequestProtocol(event)
    const host = getRequestHost(event)
    const path = event.path
    try {
        const sessionId = getCookie(event, "sessionId") || ""
        const requestUri = `${protocol}://${host}${path}`
        const signIn = new SignIn()
        const credentials = await signIn({ requestUri, sessionId })
        const { localId } = credentials
        const token = await auth.createCustomToken(localId)
        setCookie(event, "token", token)
        await sendRedirect(event, path.split("/").slice(0, -1).join("/"))
        return
    } catch (error) {
        const { message } = error as Error
        return {
            message,
        }
    }
}
