"use client"

import { FC, useEffect, useState } from "react"
import Image from "next/image"
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props {
	disabled: boolean
	onChange: (value: string) => void
	onRemove: (value: string) => void
	value: string[]
}

const ImageUpload: FC<Props> = ({ disabled, onChange, onRemove, value }) => {
	
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
				{value?.map((url) => (
					<div
						key={url}
						className="relative w-48 h-48 rounded-md overflow-auto"
					>
						<div className="absolute z-10 top-2 right-2">
							<Button
								type="button"
								onClick={() => onRemove(url)}
								variant={"destructive"}
								size={"icon"}
							>
								<Trash className="h-4 w-4" />
							</Button>
						</div>

						<Image 
							className="object-cover"
							fill
							sizes="100vw, 100vw, 100vw"
							alt="image"
							src={url}
						/>
					</div>
					
				))}
			</div>

			<CldUploadWidget
				onUpload={onUpload}
				uploadPreset="aflg6ldq"
			>
				{({ open }) => {
					function onClickHandle(e: any) {
						e.preventDefault()
						open()
					}
					return (
						<Button
							type="button"
							disabled={disabled}
							variant={"secondary"}
							onClick={onClickHandle}
						>
							<ImagePlus className="h-6 w-6 mr-4"/>
							
							Upload image
						</Button>
					)
				}}
			</CldUploadWidget>
		</div>
	)
}

export default ImageUpload