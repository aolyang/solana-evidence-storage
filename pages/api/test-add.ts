import {NextApiRequest, NextApiResponse} from "next"
import * as Web3 from "@solana/web3.js"
import {temp_user_web3keypair as signer} from "@/definitions/temp-keypair"
import {airdropSol} from "@/utils/scripts/dirdrop"
import {sendTransaction} from "@/utils/scripts/test-transaction"
import { sendUpdateTransaction } from "@/utils/scripts/test-update-transaction"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req

    if (method === "GET") {
        // const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"))
        const connection = new Web3.Connection("http://127.0.0.1:8899")
        await airdropSol(signer.publicKey, connection)
        try {
            // await sendTransaction(connection, signer)
            await sendUpdateTransaction(connection, signer)
        } catch (data: any) {
            return res.status(200).json({
                data,
                userPubKey: signer.publicKey.toBase58(),
                msg: "send transaction error"
            })
        }
    }

    return res.status(200).json({
        data: null,
        userPubKey: signer.publicKey.toBase58(),
        msg: `Method ${method} not implemented`
    })
}
