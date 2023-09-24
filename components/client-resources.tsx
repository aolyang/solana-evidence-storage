"use client"
import React, { useEffect } from "react"
import { Ripple, initTE } from "tw-elements"

export default function ClientResources({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initTE({ Ripple })
    }, [])
    return children
}
