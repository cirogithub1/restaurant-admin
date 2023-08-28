"use client"

import { FC, useEffect, useState } from "react"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ItemFormat {
	name: string
	price: number
}
interface Props {
	disabled: boolean
	onChange: (value: ItemFormat) => void
	onRemove: (value: ItemFormat) => void
	value: ItemFormat[]
}

const FormatUpload: FC<Props> = ({ disabled, onChange, onRemove, value }) => {
	
	//Start block for preventing rerendering (hydration)
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])	
	if (!isMounted) {
		return null
	} 
	//End block for preventing rerendering (hydration)

	const onUpload = (result: any) => {
		onChange(result.info.secure_url)
	}
	
	return (
		<div>
			<div className="flex mb-4 items-center gap-4">
				{value?.map((itemFormat) => (
					<div
						key={itemFormat.name}
						className="relative w-48 h-48 rounded-md overflow-auto"
					>
						<div className="absolute z-10 top-2 right-2">
							<Button
								type="button"
								onClick={() => onRemove(itemFormat)}
								variant={"destructive"}
								size={"icon"}
							>
								<Trash className="h-4 w-4" />
							</Button>
						</div>

						{/* display formats : name and price */}

						<div>
							<p>{itemFormat.name}</p>
							<p>{itemFormat.price}</p>
						</div>
					</div>
					
				))}
			</div>
		</div>
	)
}

export default FormatUpload