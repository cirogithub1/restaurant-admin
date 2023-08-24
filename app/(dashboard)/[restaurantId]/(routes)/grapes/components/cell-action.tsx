"use client"

import { FC, useState } from "react"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"

import { GrapeColumn } from "./columns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"

interface Props {
	data: GrapeColumn
}

export const CellAction: FC<Props> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id)
		toast.success("Copied to clipboard!")	
	}

	const onDelete = async () => {
		setLoading(true)

		try {
			await axios.delete(`/api/${params.restaurantId}/grapes/${data.id}`)

			router.refresh()
			toast.success("Grape deleted successfully")

		} catch (error) {
			toast.error("Remember to remove boissons from this grape first")
		} finally {
			setLoading(false)
			setOpen(false)
		}
	}

	return (
		<>
			<AlertModal 
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild >
					<Button className="h-8 w-8 p-0" variant={"ghost"} >
						<span className="sr-only">Open Menu</span>

						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuLabel>
						Actions
					</DropdownMenuLabel>

					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className="mr-2 h-4 w-4" />

						Copy
					</DropdownMenuItem>
					
					<DropdownMenuItem 
						onClick={() => router.push(`/${params.restaurantId}/grapes/${data.id}`)}
					>
						<Edit className="mr-2 h-4 w-4" />

						Update
					</DropdownMenuItem>
					
					<DropdownMenuItem
						onClick={() => setOpen(true)}
					>
						<Trash className="mr-2 h-4 w-4" />

						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}