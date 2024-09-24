import { utils, write, read } from "xlsx"
import { Buffer } from "buffer"
import { AxiosError, type AxiosResponse } from "axios"

export const fromJsonToXlsxBlob = (json: any) => {
    const workSheet = utils.json_to_sheet(json)
    const workBook = utils.book_new()
    utils.book_append_sheet(workBook, workSheet)
    const output = write(workBook, { bookType: "xlsx", bookSST: false, type: "array" })
    const blob = new Blob([output], { type: "application/octet-stream" })
    return blob
}

export const fromXlsxBlobToJson = function* <T>(buffer: Buffer, callalbe: (record: any) => T) {
    const workbook = read(buffer)
    const [firstSheetName] = workbook.SheetNames
    const worksheet = workbook.Sheets[firstSheetName]
    for (const record of utils.sheet_to_json(worksheet)) {
        const transformed = callalbe(record)
        if (!transformed) continue
        yield transformed as T
    }
}

const deserializeFromAxiosResponse = ({ type, payload }: { type: string; payload: any }) => {
    if (type === "ValidationError") {
        const { message } = payload as { message: string }
        return new Error(message)
    }
    if (type === "UserUnauthenticated") return new Error("必須先登入")
    if (type === "PermissionDenied") return new Error("未授權進行此操作")
    if (type === "TenantNotFound") {
        const { tenantId } = payload as { tenantId: string }
        return new Error(`團隊 ${tenantId} 不存在`)
    }
    if (type === "RegistryNotFound") {
        const { registryId } = payload as { registryId: string }
        return new Error(`謄本 ${registryId} 不存在`)
    }
    if (type === "OutOfCredits") {
        const { remaining, toBeDecucted } = payload as { remaining: number; toBeDecucted: number }
        return new Error(`點數不足（需要：${toBeDecucted} 點／剩餘：${remaining} 點）`)
    }
    if (type === "MustBeInPDFFormat") return new Error(`只能上傳 PDF 檔`)
    if (type === "TenantCreatingInProgress") return new Error(`建立團隊的申請已經送出請等待管理員審核`)
    if (type === "HasJoinedTenant") return new Error(`您已加入該團隊`)
    if (type === "JoinRequestAlreadySubmitted") return new Error(`加入團隊的申請已經送出請等待管理員審核`)
    if (type === "JoinRequestRejected") return new Error(`您加入該團隊的申請已被拒絕`)
    if (type === "TenantConflict") return new Error(`團隊的名稱已被使用`)
    return undefined
}

export const translateError = (throwable: unknown) => {
    if (!(throwable instanceof Error)) return undefined
    if (!(throwable instanceof AxiosError)) return throwable
    if (!throwable.response) return throwable
    const response: AxiosResponse<{ error?: { type: string; payload: any } }> = throwable.response
    if (response.data.error) {
        const error = deserializeFromAxiosResponse(response.data.error)
        if (error) return error
    }
    return throwable
}
