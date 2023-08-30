"use client"

import { FC, useState } from "react"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category, Format, Image, Vin, Region, Grape, Color } from "@prisma/client"
import * as z from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Trash , X} from "lucide-react"

import { AlertModal } from "@/components/modals/alert-modal"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input,  } from "@/components/ui/input"
import ImageUpload from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
	name: 				z.string().min(1),
	description: 	z.string().min(2),
	categoryId: 	z.string().min(1),
	regionId:			z.string().min(1),
	grapeId:			z.string().min(1),
	colorId:			z.string().min(1),
	formats: 			z.object({ 
		name: 	z.string(),
		price: 	z.coerce.number().min(1)
	}).array(),
	images: 			z.object({ 
		url: z.string()
	}).array(),
	isFeatured: 	z.boolean().default(false).optional(),
	isArchived: 	z.boolean().default(false).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
	initialData: Vin & {
		formats: 	Format[]
		images: 	Image[]
	} | null
	categories: Category[]
	regions:		Region[]
	grapes:			Grape[]
	colors:			Color[]
}

export const VinForm: FC<Props> = ({ initialData, categories, regions, grapes, colors }) => {
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData ? "Edit vin" : "Create vin"
	const descriptionMsg = initialData ? "Edit vin" : "Add a new vin"
	const toastMessage = initialData ? "Vin updated." : "Vin created."
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
				description: "",
				categoryId: "",
				regionId:	"",
				grapeId:	"",
				colorId:	"",
				formats: [{
					name: "",
					price: 0
				}],
				images: [],
				isFeatured: false,
				isArchived: false
			}
	})

	const { fields, append, remove } = useFieldArray({
    name: "formats",
    control: form.control
  })
	// console.log("this are initial values: ", fields)

	const onSubmit = async (data: FormValues) => {
		try {
			// console.log('/dashboard/componenets/settings-form.tsx: onSubmit()', data)	
			setLoading(true)		

			if (initialData) 
			{
				await axios.patch(`/api/${params.restaurantId}/vins/${params.vinId}`, data)
			} else {
				await axios.post(`/api/${params.restaurantId}/vins`, data)
			}
			
			router.refresh()
			router.push(`/${params.restaurantId}/vins`)
			toast.success(toastMessage)

		} catch (error) {
			console.log('/app/(dashboard)/[restaurantId]/routes)/vins/[vinId]/components/vin-form.tsx => onSubmit=> error: ', error)
			setLoading(false)
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			const resp = await fetch(`/api/${params.restaurantId}/vins/${params.vinId}`, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
				}
			})

			router.refresh()
			router.push(`/${params.restaurantId}/vins`)
			toast.success("Vin deleted successfully")

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
					description={descriptionMsg} />
				
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
											placeholder="Vin name" 
											{...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* description */}
						<FormField 
							control={form.control}
							name="description"
							render={({ field }) =>(
								<FormItem>
									<FormLabel>Description</FormLabel>

									<FormControl>
										<Input 
											disabled={loading}
											placeholder="Description" 
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

						{/* region */}
						<FormField 
							control={form.control}
							name="regionId"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Region</FormLabel>

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
													placeholder="Select a region" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{regions?.map((region) => (
												<SelectItem
													key={region.id}
													value={region.id}
												>
													{region.name}
												</SelectItem>
											))}

										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>

						{/* grape */}
						<FormField 
							control={form.control}
							name="grapeId"
							render={({ field}) =>(
								<FormItem>
									<FormLabel>Grape</FormLabel>

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
													placeholder="Select a grape" />
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{grapes?.map((grape) => (
												<SelectItem
													key={grape.id}
													value={grape.id}
												>
													{grape.name}
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

					{/* Formats */}
					<div className="flex-col gap-8">
						<div className="flex-col pb-3">
							{fields.map((field, index) => {
								return (
									<div key={field.id}>
										<div className="flex w-full gap-4">
											<FormField 
												control={form.control}
												name={`formats.${index}.name`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Format</FormLabel>

														<FormControl>
															<Input
																disabled={loading}
																placeholder="Format name" 
																{...field} />
														</FormControl>

														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField 
												control={form.control}
												name={`formats.${index}.price`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Price</FormLabel>

														<FormControl>
															<div className="flex gap-4">
																<Input
																	disabled={loading}
																	placeholder="Format price" 
																	{...field} />

																<Button
																	className="h-5 w-6 self-center"	
																	variant={"destructive"}
																	size={'icon'}
																	disabled={loading}
																	onClick={() => remove(index)}
																>
																	<X className="h-4 w-4" />
																</Button>
															</div>

														</FormControl>

														<FormMessage />
													</FormItem>															
												)}
											/>
										</div>
									</div>
								)
							})}
						</div>

						<Button
							className="ml-auto h-fit bg-blue-400"
							disabled={loading}
							type="button"
							onClick={() => append({ name: "new format", price: 0.99 })}
						>
							Add Format
						</Button>
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
											This vin will be displayed on the home page
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
											This vin will not be displayed on the home page
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>

					<Button
						className="ml-auto text-xl"
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