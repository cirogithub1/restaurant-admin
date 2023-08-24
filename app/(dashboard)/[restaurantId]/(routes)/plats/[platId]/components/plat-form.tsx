"use client"

import { FC, useState } from "react"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category, Format, Image, Plat } from "@prisma/client"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"
import ImageUpload from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
	name: 				z.string().min(1),
	description: 	z.string().min(1),
	categoryId: 	z.string().min(1),
	formats: 			z.object(
		{ 
			name: 	z.string(),
			price: 	z.coerce.number().min(1)
		}
	).array(),
	images: 			z.object({ url: z.string()}).array(),
	isFeatured: 	z.boolean().default(false).optional(),
	isArchived: 	z.boolean().default(false).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	initialData: Plat & {
		formats: 	Format[]
		images: 	Image[]
	} | null
	categories: Category[]
}

export const PlatForm: FC<Props> = ({ initialData, categories }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit plat" : "Create plat"
	const description = initialData ? "Edit plat" : "Add a new plat"
	const toastMessage = initialData ? "Plat updated." : "Plat created."
	const action = initialData ? "Save changes" : "Create"

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData 
		? 
			{
				...initialData,
				formats: initialData?.formats.map((itemFormat) => {
					const newItem:{name: string, price: number} = {
						name: itemFormat.name || '{}',
						price: parseFloat(String(itemFormat.price))
					}
					return newItem

				})
			} 
		: 
			{
				name: "",
				images: [],
				formats: [],
				categoryId: "",
				isFeatured: false,
				isArchived: false
			}
	})

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/dashboard/componenets/settings-form.tsx: onSubmit()', data)	
			setLoading(true)		

			if (initialData) 
			{
				await axios.patch(`/api/${params.storeId}/plats/${params.platId}`, data)
			} else {
				await axios.post(`/api/${params.storeId}/plats`, data)
			}
			
			router.refresh()
			router.push(`/${params.storeId}/plats`)
			toast.success(toastMessage)

		} catch (error) {
			console.log('/dashboard/[plat]/onSubmit/error: ', error)
			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			const resp = await fetch(`/api/${params.storeId}/plats/${params.platId}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				}
			})

			router.refresh()
			router.push(`/${params.storeId}/plats`)
			toast.success("Plat deleted successfully")

		} catch (error) {
			toast.error("Something went wrong")
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
					{/* images */}
					<FormField 
						control={form.control}
						name="images"
						render={({ field }) =>(
							<FormItem>
								<FormLabel>Images</FormLabel>

								<FormControl>
									<ImageUpload 
										value={field.value.map((image) => image.url)}
										disabled={loading}
										onChange={(url) => field.onChange([...field.value, { url }])} 
										onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					
					<div className="grid grid-cols-3 gap-8">
						{/* name */}
						<FormField 
							control={form.control}
							name="name"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Plat name" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						
						{/* price is of type Decimal that's why the Warning */}
						<FormField 
							control={form.control}
							name="formats"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>Formats</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="9.99" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* category */}
						<FormField 
							control={form.control}
							name="categoryId"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Category</FormLabel>

									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue 
													defaultValue={field.value} 
													placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{categories?.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}
												>
													{category.name}
												</SelectItem>
											))}

										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* sixe */}
						<FormField 
							control={form.control}
							name="sizeId"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Size</FormLabel>

									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue 
													defaultValue={field.value} 
													placeholder="Select a size" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{sizes?.map((size) => (
												<SelectItem
													key={size.id}
													value={size.id}
												>
													{size.name}
												</SelectItem>
											))}

										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* color */}
						<FormField 
							control={form.control}
							name="colorId"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Color</FormLabel>

									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue 
													defaultValue={field.value} 
													placeholder="Select a color" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{colors?.map((color) => (
												<SelectItem
													key={color.id}
													value={color.id}
												>
													{color.name}
												</SelectItem>
											))}

										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Featured */}
						<FormField 
							control={form.control}
							name="isFeatured"
							render={({ field }) =>(
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox 
											checked = {field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>

									<div className="space-y-1 leading-none">
										<FormLabel>
											Featured ?
										</FormLabel>

										<FormDescription>
											This plat will be displayed on the home page
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						{/* Archived  */}
						<FormField 
							control={form.control}
							name="isArchived"
							render={({ field }) =>(
								<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox 
											checked = {field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>

									<div className="space-y-1 leading-none">
										<FormLabel>
											Archived ?
										</FormLabel>

										<FormDescription>
											This plat will not be displayed on the home page
										</FormDescription>
									</div>
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