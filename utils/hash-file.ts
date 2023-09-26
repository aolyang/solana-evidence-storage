export const hashFile = async (file: File) => {
   // use crypto api to hash the file as digest sha-256
    const crypto = window.crypto
    const fileData = await readFileAsBinary(file)
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fileData as any))
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("")
}

export const readFileAsBinary = (file: File) => {
    return new Promise(r => {
        const reader = new FileReader()
        reader.onload = () => {
            r(reader.result)
        }
        reader.readAsBinaryString(file)
    })
}
