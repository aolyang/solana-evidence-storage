import * as Web3 from "@solana/web3.js"

export async function airdropSol(
    pubKey: Web3.PublicKey,
    connection: Web3.Connection
) {
    // 检查余额
    const balance = await connection.getBalance(pubKey)
    console.log("当前余额为", balance / Web3.LAMPORTS_PER_SOL, "SOL")

    // 如果余额少于 1 SOL，执行空投
    if (balance / Web3.LAMPORTS_PER_SOL < 1) {
        console.log("正在空投 1 SOL")
        const airdropSignature = await connection.requestAirdrop(
            pubKey,
            Web3.LAMPORTS_PER_SOL
        )

        const latestBlockHash = await connection.getLatestBlockhash()

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignature
        })

        const newBalance = await connection.getBalance(pubKey)
        console.log("新余额为", newBalance / Web3.LAMPORTS_PER_SOL, "SOL")
    }
}
