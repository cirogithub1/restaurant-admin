"use client"

import { FC, ReactNode, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ModalProps {
	title: string
	description: string
	isOpen: boolean
	onClose: () => void
	children?: ReactNode
}

export const Modal: FC<ModalProps> = ({
	title,
	description,
	isOpen,
	onClose,
	children
}) => {

	// Start Preventing Hydration Errors
	const [isMounted, setIsMounted] = useState(false)	
	useEffect(() => {
		setIsMounted(true)
	}, [])
	if (!isMounted) return null	
	// End Preventing Hydration Errors

	const onChange = (open: boolean) => {
		if (!open) {
			onClose()
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onChange}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-xl font-extrabold">{title}</DialogTitle>
					
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<div>
					{children}
				</div>
			</DialogContent>
		</Dialog>
	)
}