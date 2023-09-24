import clsx from "clsx"

export const themeVariants = ["primary", "secondary", "success", "danger", "warning", "info"] as const

export type themeVariant = typeof themeVariants[number]
export const themeActionVariants: Record<themeVariant, string> = {
    primary: clsx("bg-primary", "hover:bg-primary-600", "focus:bg-primary-600", "active:bg-primary-700"),
    secondary: clsx("bg-secondary-100", "hover:bg-secondary-200", "focus:bg-secondary-200", "active:bg-secondary-300"),
    success: clsx("bg-success", "hover:bg-success-600", "focus:bg-success-600", "active:bg-success-700"),
    danger: clsx("bg-danger", "hover:bg-danger-600", "focus:bg-danger-600", "active:bg-danger-700"),
    warning: clsx("bg-warning", "hover:bg-warning-600", "focus:bg-warning-600", "active:bg-warning-700"),
    info: clsx("bg-info", "hover:bg-info-600", "focus:bg-info-600", "active:bg-info-700")
}

export const themeTextVariants: Record<themeVariant, string> = {
    primary: clsx("text-white"),
    secondary: clsx("text-black/[64]"),
    success: clsx("text-white"),
    danger: clsx("text-white"),
    warning: clsx("text-white"),
    info: clsx("text-white")
}
