import { useRef } from "react"
import {
    TEInput,
    TEModal,
    TEModalBody,
    TEModalContent,
    TEModalDialog,
    TEModalFooter,
    TEModalHeader
} from "tw-elements-react"
import * as web3 from "@solana/web3.js"
import Button from "@/components/ui/button"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Evidence } from "@/definitions/instruction"
import { WEB3_PUBKEY_PROGRAM_ID } from "@/definitions/temp-keypair"
import { airdropSol } from "@/utils/scripts/dirdrop"
import { hashFile } from "@/utils/hash-file"

type Props = {
    open: boolean
    onClose: () => void
}

export function AddEvidenceDialog({ open, onClose }: Props) {
    const formRef = useRef<HTMLFormElement>(null)

    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()

    const handleTransaction = async (evidence: Evidence) => {
        if (!publicKey) return
        try {
            await airdropSol(publicKey, connection)
        } catch (e) {
            console.log("airdrop error??", e)
        }

        const buffer = evidence.serialize()
        const transaction = new web3.Transaction()

        const [pda] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer(), Buffer.from(evidence.file_name)],
            WEB3_PUBKEY_PROGRAM_ID
        )

        const instruction = new web3.TransactionInstruction({
            data: buffer,
            programId: WEB3_PUBKEY_PROGRAM_ID,
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ]
        })
        transaction.add(instruction)
        try {
            const tx = await sendTransaction(transaction, connection).catch(e => {
                console.log("交易失败", JSON.stringify(e))
            })
            onClose()
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${tx}?cluster=devnet`)
        } catch (e) {
            console.log(JSON.stringify(e))
        }
    }
    const handleFormSubmit = async () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current) as any as Map<string, string>
        const file = formData.get("file") as any as File
        const fileHash = await hashFile(file)

        if (!file) {
            alert("no file selected!")
            return
        }
        const evidence = new Evidence(
            file.name,
            formData.get("description") || "",
            file.size + "",
            fileHash
        )
        console.log(">>>>>>>>>>>>>>>. evidence", evidence)
        await handleTransaction(evidence)
        console.log("submit finished!!!")
    }
    return (
        <TEModal show={open} setShow={onClose}>
            <TEModalDialog>
                <TEModalContent>
                    <TEModalHeader>Add Evidence</TEModalHeader>
                    <TEModalBody>
                        <form ref={formRef} className={"flex gap-2 flex-col"}>
                            <input
                                name={"file"}
                                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                type="file"
                                id="formFile"/>
                            <TEInput name={"description"} label={"evidence description"}/>
                        </form>
                    </TEModalBody>
                    <TEModalFooter className={"gap-2"}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button variant={"primary"} onClick={handleFormSubmit}>Confirm</Button>
                    </TEModalFooter>
                </TEModalContent>
            </TEModalDialog>
        </TEModal>
    )
}
