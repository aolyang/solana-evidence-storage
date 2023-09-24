"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p>SignIn your wallet!</p>
      <WalletMultiButton/>
    </main>
  )
}
