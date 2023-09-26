import * as Web3 from "@solana/web3.js"
import { WEB3_PUBKEY_PROGRAM_ID } from "@/definitions/temp-keypair"
import web3 from "@solana/web3.js"
import { Evidence } from "@/definitions/instruction"

export async function sendTransaction(connection: Web3.Connection, payer: Web3.Keypair) {
    const evidence = new Evidence(
        "file_name2",
        "description",
        "file_size",
        "file_hash"
    )
    const buffer = evidence.serialize()
    const [pda] = await web3.PublicKey.findProgramAddress(
        [payer.publicKey.toBuffer(), Buffer.from(evidence.file_name)],
        WEB3_PUBKEY_PROGRAM_ID
    )
    const instruction = new Web3.TransactionInstruction({
        keys: [
            {
                pubkey: payer.publicKey,
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
        ],
        data: buffer,
        programId: WEB3_PUBKEY_PROGRAM_ID

    })

    const transaction = new Web3.Transaction().add(instruction)

    const transactionSignature = await Web3.sendAndConfirmTransaction(connection, transaction, [payer])

    console.log(
        `Transaction https://explorer.solana.com/tx/${transactionSignature}?cluster=localhost`
    )
}
