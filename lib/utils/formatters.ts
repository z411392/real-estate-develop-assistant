import { utils, write, read } from "xlsx"
import { Buffer } from "buffer"

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
