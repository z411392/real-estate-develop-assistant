import { Pages } from "~/lib/constants"
import { useStorage } from "@vueuse/core"

enum SessionKeys {
    RedirectTo = "RedirectTo",
    Token = "token",
}

export const withRedirectTo = (setDefaultURL: boolean = false) => {
    return useStorage<string | undefined>(SessionKeys.RedirectTo, setDefaultURL ? Pages.Tenants.fullPath() : undefined)
}

export const withToken = () => {
    return useCookie(SessionKeys.Token)!
}
