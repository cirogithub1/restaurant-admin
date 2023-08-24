"use client"

import { FC, useState } from "react"
import axios from "axios"
import { Billboard } from "@prisma/client"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"
import ImageUpload from "@/components/ui/image-upload"

const formSchema = z.object({
	name: z.string().min(1),
	imageUrl: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	initialData: Billboard | null
}

export const BillboardForm: FC<Props> = ({ initialData }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit billboard" : "Create billboard"
	const description = initialData ? "Edit billboard" : "Add a new billboard"
	const toastMessage = initialData ? "Billboard updated." : "Billboard created."
	const action = initialData ? "Save changes" : "Create"

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			imageUrl: ""
		}
	})

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/dashboard/componenets/settings-form.tsx: onSubmit()', data)	
			setLoading(true)		

			if (initialData) 
				{
					await axios.patch(`/api/${params.restaurantId}/billboards/${params.billboardId}`, data)
				} else {
					await axios.post(`/api/${params.restaurantId}/billboards`, data)
				}
			
			router.refresh()
			router.push(`/${params.restaurantId}/billboards`)
			toast.success(toastMessage)

		} catch (error) {
			toast.error("Something went wrong")
			console.log('/components/modals/restaurant-modal.tsx error: ', error)
			setLoading(false)

		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/${params.restaurantId}/billboards/${params.billboardId}`) 

			router.refresh()
			router.push(`/${params.restaurantId}/billboards`)
			toast.success("Billboard deleted successfully")

		} catch (error) {
			toast.error("Remember to remove categories from this billboard first")
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
			 
			<div className="flex items-center justify-between">
				<Heading 
					title= {title}
					description={description} />
				
				{initialData &&
					<Button
						variant={"destructive"}
						size={'sm'}
						disabled={loading}
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				}
			</div>

			<Separator />

			<Form {...form}>
				<form 
					className="space-y-6 w-full" 
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField 
						control={form.control}
						name="imageUrl"
						render={({ field }) =>(
							<FormItem>
								<FormLabel>Background image</FormLabel>

								<FormControl>
									<ImageUpload 
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url) => field.onChange(url)} 
										onRemove={() => field.onChange("")}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					
					<div className="grid grid-cols-3 gap-8">
						<FormField 
							control={form.control}
							name="name"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>Label</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Billboard label" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						className="ml-auto"
						type="submit"
						disabled={loading}
					>
						{action}
					</Button>
				</form>
			</Form>
		</>
	)
}