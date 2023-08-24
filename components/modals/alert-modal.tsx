"use client"

import { FC, useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

interface Props {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	loading: boolean
}

export const AlertModal: FC<Props> = ({
	isOpen,
	onClose,
	onConfirm,
	loading
}) => {

	// Start Prevent rerender the component when the modal is closed
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])
	if (!isMounted) return null
	// End Prevent rerender the component when the modal is closed

	return (
		<Modal
			title="Delete action requested"
			description="Are you sure to delete this item ?"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button
					disabled={loading}
					variant={"outline"}
					onClick={onClose}
				>
					Cancel
				</Button>

				<Button
					disabled={loading}
					variant={"destructive"}
					onClick={onConfirm}
				>
					Continue
				</Button>
			</div>

		</Modal>
	)
}