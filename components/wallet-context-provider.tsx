"use client"
import { FC, ReactNode } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

import "@solana/wallet-adapter-react-ui/styles.css"
import { rpcURL } from "@/definitions/program"

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const wallets = [new PhantomWalletAdapter()]

    return (
        <ConnectionProvider endpoint={rpcURL}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* Your app's components go here, nested within the context providers. */}
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletContextProvider
