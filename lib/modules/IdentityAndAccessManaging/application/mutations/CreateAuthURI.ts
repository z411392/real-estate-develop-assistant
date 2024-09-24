import CallableInstance from "callable-instance"
import { type ConsolaInstance, createConsola } from "consola"
import { GoogleAuthService } from "~/lib/adapters/http/GoogleAuthService"

export type CreatingAuthURI = {
    providerId: string
    continueUri: string
}

export class CreateAuthURI extends CallableInstance<
    [CreatingAuthURI],
    Promise<{ authUri: string; sessionId: string }>
> {
    protected logger: ConsolaInstance
    protected googleAuthService: GoogleAuthService
    constructor() {
        super("execute")
        this.logger = createConsola().withTag(`CreateAuthURI`)
        this.googleAuthService = new GoogleAuthService({ key: process.env.FIREBASE_API_KEY! })
    }
    async execute(query: CreatingAuthURI) {
        const { providerId, continueUri } = query
        const { authUri, sessionId } = await this.googleAuthService.createAuthURI(providerId, continueUri)
        return {
            authUri,
            sessionId,
        }
    }
}
