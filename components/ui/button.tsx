import React, { ButtonHTMLAttributes } from "react"
import clsx from "clsx"
import { TERipple } from "tw-elements-react"
import { themeActionVariants, themeTextVariants, themeVariant } from "@/utils/theme"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    uppercase?: boolean
    variant?: themeVariant
    children?: React.ReactNode
}
export default function Button({ children, className, variant = "secondary", uppercase = false, ...props }: ButtonProps) {
    return <TERipple rippleColor={"light"}>
        <button
            {...props}
            type="button"
            className={clsx([
                className,
                themeActionVariants[variant],
                themeTextVariants[variant],
                {
                  "uppercase": uppercase,
                },
                "flex items-center justify-center",
                "inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium leading-normal transition duration-150 ease-in-out",
                "focus:ring-0",
                "focus:outline-none"
            ])
            }>
            {children}
        </button>
    </TERipple>
}
