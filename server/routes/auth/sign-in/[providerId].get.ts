import { onExchangingToken } from "~/lib/modules/IdentityAndAccessManaging/presentation/controllers/onExchangingToken"
import { onSigningIn } from "~/lib/modules/IdentityAndAccessManaging/presentation/controllers/onSigningIn"

export default defineEventHandler((event) => {
    const { code } = getQuery(event) as { code?: string }
    return code ? onExchangingToken(event) : onSigningIn(event)
})