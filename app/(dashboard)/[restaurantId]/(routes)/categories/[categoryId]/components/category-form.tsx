"use client"

import { FC, useState } from "react"
import { Billboard, Category } from "@prisma/client"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
	name: z.string().min(1),
	billboardId: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	billboards: Billboard[] | null
	initialData: Category | null
}

export const CategoryForm: FC<Props> = ({ initialData, billboards }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit category" : "Create category"
	const description = initialData ? "Edit category" : "Add a new category"
	const toastMessage = initialData ? "Category updated." : "Category created."
	const action = initialData ? "Save changes" : "Create"

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			billboardId: ""
		}
	})

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/[categoryId]/componenets/category-form.tsx: onSubmit()', data)	
			setLoading(true)		

			let response
			if (initialData) 
			{
				await axios.patch(`/api/${params.restaurantId}/categories/${params.categoryId}`, data)
			} else {
				await axios.post(`/api/${params.restaurantId}/categories`, data)
			}
			
			router.refresh()
			router.push(`/${params.restaurantId}/categories`)
			toast.success(toastMessage)
			
		} catch (error) {
			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/${params.restaurantId}/categories/${params.categoryId}`)

			router.refresh()
			router.push(`/${params.restaurantId}/categories`)
			toast.success("Category deleted successfully")

		} catch (error) {
			toast.error("Remember to remove products from this category first")
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
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Category name" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField 
							control={form.control}
							name="billboardId"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>Billboard</FormLabel>

									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue defaultValue={field.value} placeholder="Select a billboard" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{billboards?.map((billboard) => (
												<SelectItem key={billboard.id} value={billboard.id}>
													{billboard.name}
												</SelectItem>
											))}

										</SelectContent>
									</Select>

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