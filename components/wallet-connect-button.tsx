import React, {  useEffect, useMemo, useRef, useState } from "react"
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui"
import Button from "@/components/ui/button"
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui"
import { copyText } from "@/utils/copy"

const labels = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': 'Select Wallet',
} as const;


const labelFromButtonState = (buttonState: ReturnType<typeof useWalletMultiButton>["buttonState"]) => {
    switch (buttonState) {
        case "connected":
            return "Disconnect"
        case "connecting":
            return "Connecting"
        case "disconnecting":
            return "Disconnecting"
        case "has-wallet":
            return "Connect"
        case "no-wallet":
            return "Select Wallet"
    }
}

export function WalletConnectButton() {
    const { setVisible: setModalVisible } = useWalletModal()

    const { buttonState, onConnect, onDisconnect, walletName, walletIcon, publicKey } = useWalletMultiButton({
        onSelectWallet: () => {
            setModalVisible(true)
        }
    })
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false)
    const ref = useRef<HTMLUListElement>(null)
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return

            setMenuOpen(false)
        }

        document.addEventListener("mousedown", listener)
        document.addEventListener("touchstart", listener)

        return () => {
            document.removeEventListener("mousedown", listener)
            document.removeEventListener("touchstart", listener)
        }
    }, [])

    const handleClick = () => {
        switch (buttonState) {
            case "no-wallet":
                setModalVisible(true)
                break
            case "has-wallet":
                if (onConnect) {
                    onConnect()
                }
                break
            case "connected":
                setMenuOpen(true)
                break
        }
    }
    const label = labelFromButtonState(buttonState)
    const content = useMemo(() => {
            if (walletIcon && walletName && publicKey) {
                const pubName = publicKey.toBase58()
                return (
                    <>
                        <i className={"wallet-adapter-button-start-icon"}>
                            <WalletIcon wallet={{ adapter: { icon: walletIcon, name: walletName } }}/>
                        </i>
                        {pubName.slice(0, 4)}...{pubName.slice(-4)}
                    </>
                )
            } else {
                return label
            }
        }, [walletIcon, walletName, publicKey, label]
    )

    return (
        <div className={"wallet-adapter-dropdown"}>
            <Button
                disabled={buttonState === "connecting" || buttonState === "disconnecting"}
                onClick={handleClick}>
                {content}
            </Button>
            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${menuOpen && "wallet-adapter-dropdown-list-active"}`}
                ref={ref}
                role="menu"
            >
                {publicKey ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={async () => {
                            await copyText(publicKey.toBase58())
                            setCopied(true)
                            setTimeout(() => setCopied(false), 400)
                        }}
                        role="menuitem"
                    >
                        {copied ? labels["copied"] : labels["copy-address"]}
                    </li>
                ) : null}
                <li
                    className="wallet-adapter-dropdown-list-item"
                    onClick={() => {
                        setModalVisible(true)
                        setMenuOpen(false)
                    }}
                    role="menuitem"
                >
                    {labels["change-wallet"]}
                </li>
                {onDisconnect ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={() => {
                            onDisconnect()
                            setMenuOpen(false)
                        }}
                        role="menuitem"
                    >
                        {labels["disconnect"]}
                    </li>
                ) : null}
            </ul>
        </div>
    )
}
