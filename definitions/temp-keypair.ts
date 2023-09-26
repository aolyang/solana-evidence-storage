import * as Web3 from "@solana/web3.js"
import { ProgramId } from "@/definitions/program"
export const temp_user_secret = [
    6, 88, 133, 230, 16, 114, 72, 56, 13, 190,
    48, 42, 137, 63, 152, 90, 92, 97, 94, 122,
    64, 74, 137, 0, 13, 184, 177, 180, 230, 29,
    234, 123, 250, 230, 18, 47, 149, 46, 155,
    199, 182, 93, 3, 9, 86, 215, 222, 156, 0,
    171, 2, 75, 246, 111, 213, 17, 40, 232,
    99, 9, 201, 108, 184, 21
]
export const temp_user_secret_key = Uint8Array.from(temp_user_secret)

// initialize a keypair from secret key
// also named signer
export const temp_user_web3keypair = Web3.Keypair.fromSecretKey(temp_user_secret_key)

export const WEB3_PUBKEY_PROGRAM_ID = new Web3.PublicKey(ProgramId)
export const WEB3_PUBKEY_TEMP_USER = temp_user_web3keypair.publicKey
