export const copyText = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
    } catch (e) {
        // use input element and execCommand
        const input = document.createElement("input")
        input.style.position = "fixed"
        input.style.opacity = "0"
        input.value = text
        document.body.appendChild(input)
        input.select()
        document.execCommand("copy")
        document.body.removeChild(input)
    }
}
