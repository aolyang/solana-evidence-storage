import type { Metadata } from "next"

import "./globals.css"
import { Roboto } from "next/font/google"

import WalletContextProvider from "@/components/wallet-context-provider"
import ClientResources from "@/components/client-resources"
import "tw-elements-react/dist/css/tw-elements-react.min.css"

const roboto = Roboto({ weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Evidence Storage",
    description: "Solana Evidence Storage Program Example"
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={roboto.className}>
        <ClientResources>
            <WalletContextProvider>
                {children}
            </WalletContextProvider>
        </ClientResources>
        </body>
        </html>
    )
}
