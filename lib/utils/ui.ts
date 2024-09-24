export const downloadBlob = (blob: Blob, filename?: string) => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    if (filename) a.download = filename
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
}

const fallbackCopyTextToClipboard = (text: string) => {
    var textArea = document.createElement("textarea")
    textArea.value = text

    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
        document.execCommand("copy")
    } catch {}

    document.body.removeChild(textArea)
}
export const copyTextToClipboard = async (text: string, callable?: (text: string) => any | Promise<any>) => {
    if (navigator.clipboard) await navigator.clipboard.writeText(text)
    else fallbackCopyTextToClipboard(text)
    if (callable) await callable(text)
}
