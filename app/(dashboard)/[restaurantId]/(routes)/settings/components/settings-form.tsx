"use client"

import { FC, useState } from "react"
import { Restaurant } from "@prisma/client"
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
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import axios from "axios"

interface Props {
	initialData: Restaurant
}

const formSchema = z.object({
	name: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

export const SettingsForm: FC<Props> = ({ initialData }) => {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const params = useParams()
	const router = useRouter()
	const origin = useOrigin()

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
	})

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/dashboard/componenets/settings-form.tsx: onSubmit()', data)	
			setLoading(true)	

			await axios.patch(`/api/restaurants/${params.restaurantId}`, data)
			// console.log("app/(dashboard)/[restaurantId]/routes)/settings/components/settings-form.tsx params: ", params)
			
			router.refresh()
			toast.success("Restaurant saved successfully")

		} catch (error) {
			toast.error("Error saving restaurant")
			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)

			await axios.delete(`/api/restaurants/${params.restaurantId}`)
			router.refresh()
			router.push('/')
			toast.success("Restaurant deleted successfully")

		} catch (error) {
			toast.error("Remember to remove products and categories first")
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
					title= "Settings"
					description="Manage your restaurant settings" />
				
				<Button
					variant={"destructive"}
					size={'sm'}
					disabled={loading}
					onClick={() => setOpen(true)}
				>
					<Trash className="h-4 w-4" />

				</Button>
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
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Restaurant name" 
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
						Save changes
					</Button>
				</form>
			</Form>

			<Separator />

			<ApiAlert 
				title="NEXT_PUBLIC_API_URL" 
				description={`${origin}/api/${params.restaurantId}`} 
				variant="public"/>
		</>
	)
}