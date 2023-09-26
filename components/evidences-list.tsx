"use client"
import { useEffect, useRef, useState } from "react"
import * as web3 from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import { TEInput } from "tw-elements-react"
import Button from "@/components/ui/button"
import { AddEvidenceDialog } from "@/components/add-evidence-dialog"
import { IEvidence } from "@/definitions/instruction"
import ProgramCoordinator from "@/utils/coordinator"
import { rpcURL } from "@/definitions/program"

export function EvidencesList() {
    const [connection] = useState(
        new web3.Connection(rpcURL)
    )
    const [fetching, setFetching] = useState(false)
    const { connected, connecting, publicKey } = useWallet()

    const inputRef = useRef<HTMLInputElement>(null)
    const [evidences, setEvidences] = useState<IEvidence[]>([])
    const [page, setPage] = useState(1)

    const [show, setShow] = useState(false)

    const search = (value: string) => {
        setFetching(true)
        let setFetchingFalse: undefined | (() => void) = undefined
        let timer: number | null = window.setTimeout(() => {
            setFetchingFalse?.()
            timer = null
        }, 500)
        ProgramCoordinator.fetchEvidences(connection, page, 5, value, value !== "").then((value) => {
            setEvidences(value)
            if (!timer) setFetching(false)
            else {
                setFetchingFalse = () => setFetching(false)
            }
        })
    }

    const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            search(event.currentTarget.value)
        }
    }
    useEffect(() => {
        if (connected && inputRef.current) {
            search(inputRef.current.value || "")
        }
        // eslint-disable-next-line
    }, [connected])
    return (
        <div className={"w-full h-full"}>
            <div className={"flex gap-4 p-1"}>
                <TEInput ref={inputRef} placeholder={"press Enter to search!"} label={"search evidences"}
                         onKeyUp={handleInputKeyUp}/>
                <Button disabled={!publicKey} variant={"primary"} onClick={() => setShow(true)}>Add +</Button>
            </div>
            <div className={"overflow-y-auto"} style={{ height: "calc(100% - 44px)" }}>
                <ul className={"h-full overflow-y-auto"}>
                    {evidences.map((evidence, index) => {
                        return (
                            <li key={evidence.hash + index} className={"border-secondary border-[1px] rounded-[4px] mb-2 p-1"}>
                                <h1 className={"m-0 text-lg font-medium leading-tight text-neutral-800 dark:text-neutral-50"}>{evidence.file_name}</h1>
                                <p>简介: {evidence.description}</p>
                                <p>文件大小: {evidence.size}</p>
                                <p>文件hash: {evidence.hash}</p>
                            </li>
                        )
                    })}
                    {fetching && <li>fetching...</li>}
                    {connecting && <li>connecting...</li>}
                    {evidences.length === 0 && <li>no evidences found</li>}
                </ul>
            </div>
            <AddEvidenceDialog
                open={show}
                onClose={() => setShow(false)} />
        </div>
    )
}
