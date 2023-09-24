"use client"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function Home() {
    return (
        <main className="w-full h-full flex min-h-screen flex-col items-center p-2">
            <WalletConnectButton/>
            <div style={{ height: "calc(100% - 42px)" }}>
                <h1>Hello world</h1>
            </div>
        </main>
    )
}
