import CallableInstance from "callable-instance"
import { type Credentials } from "~/lib/modules/IdentityAndAccessManaging/dtos/Credentials"
import { type ConsolaInstance, createConsola } from "consola"
import { GoogleAuthService } from "~/lib/adapters/http/GoogleAuthService"

export type SigningInWithIdentityProvider = {
    requestUri: string
    sessionId: string
}

export class SignIn extends CallableInstance<[SigningInWithIdentityProvider], Promise<Credentials>> {
    protected logger: ConsolaInstance
    protected googleAuthService: GoogleAuthService
    constructor() {
        super("execute")
        this.logger = createConsola().withTag(`SignIn`)
        this.googleAuthService = new GoogleAuthService({ key: process.env.FIREBASE_API_KEY! })
    }
    async execute(mutation: SigningInWithIdentityProvider) {
        const { requestUri, sessionId } = mutation
        const credentials = await this.googleAuthService.signInWithIdentityProvider(requestUri, sessionId)
        return credentials
    }
}
