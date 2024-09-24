import axios from "axios"
import { type Credentials } from "~/lib/modules/IdentityAndAccessManaging/dtos/Credentials"

export class GoogleAuthService {
    protected key: string
    constructor({ key }: { key: string }) {
        this.key = key
    }
    async createAuthURI(providerId: string, continueUri: string, customParameter: any = {}) {
        const { data } = await axios.post<{ authUri: string; sessionId: string }>(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri`,
            {
                providerId,
                continueUri,
                customParameter,
            },
            { params: { key: this.key } },
        )
        return data
    }
    async signInWithIdentityProvider(requestUri: string, sessionId: string) {
        const { data } = await axios.post<Credentials>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp`,
            {
                requestUri,
                returnSecureToken: true,
                returnIdpCredential: true,
                sessionId,
            },
            { params: { key: this.key } },
        )
        return data
    }
}
