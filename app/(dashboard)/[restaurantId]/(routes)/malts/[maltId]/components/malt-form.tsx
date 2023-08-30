"use client"

import { FC, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Malt } from "@prisma/client"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
	name: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	initialData: Malt | null
}

export const MaltForm: FC<Props> = ({ initialData }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit malt" : "Create malt"
	const description = initialData ? "Edit malt" : "Add a new malt"
	const toastMessage = initialData ? "Malt updated." : "Malt created."
	const action = initialData ? "Save changes" : "Create"

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: ""
		}
	})

	const onSubmit = async (data: FormValues) => {
		try {
			setLoading(true)		

			if (initialData) 
				{
					await axios.patch(`/api/${params.restaurantId}/malts/${params.maltId}`, data)
				} else {
					await axios.post(`/api/${params.restaurantId}/malts`, data)
				}
			
			router.refresh()
			router.push(`/${params.restaurantId}/malts`)
			toast.success(toastMessage)

		} catch (error) {
			console.log('/malts-form/onSubmit error: ', error)
			toast.error('Something went wrong.')

			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/${params.restaurantId}/malts/${params.maltsId}`)

			router.refresh()
			router.push(`/${params.restaurantId}/malts`)
			toast.success("Malt deleted successfully")

		} catch (error) {
			toast.error("Remember to remove vins from this malts first")
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
					<div className="grid grid-cols-3 gap-8">
						<FormField 
							control={form.control}
							name="name"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>
										Name
									</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Malt name" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						className="ml-auto text-lg"
						type="submit"
						size={'lg'}
						disabled={loading}
					>
						{action}
					</Button>
				</form>
			</Form>
		</>
	)
}