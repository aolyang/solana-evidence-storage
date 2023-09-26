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
import { Evidence, IEvidence } from "@/definitions/instruction"
import { WEB3_PUBKEY_PROGRAM_ID } from "@/definitions/temp-keypair"
import { airdropSol } from "@/utils/scripts/dirdrop"
import { hashFile } from "@/utils/hash-file"

type Props = {
    evidence?: IEvidence
    onClose: () => void
}

export function UpdateEvidenceDialog({ evidence, onClose }: Props) {
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

        const buffer = evidence.serialize(1)
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
        if (!formRef.current || !evidence) return
        const formData = new FormData(formRef.current) as any as Map<string, string>

        const { file_name, description, size, hash} = evidence
        const newEvidence = new Evidence(
            formData.get("file_name") || file_name,
            formData.get("description") || description,
            size,
            hash
        )

        await handleTransaction(newEvidence)
        console.log("submit finished!!!")
    }
    return (
        <TEModal show={!!evidence} setShow={onClose}>
            <TEModalDialog>
                <TEModalContent>
                    <TEModalHeader>Add Evidence</TEModalHeader>
                    <TEModalBody>
                        <form ref={formRef} className={"flex gap-2 flex-col"}>
                            <TEInput defaultValue={evidence?.file_name} name={"file_name"} label={"evidence file name"}></TEInput>
                            <TEInput defaultValue={evidence?.description} name={"description"} label={"evidence description"}/>
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
