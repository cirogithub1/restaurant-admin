"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"	
import axios from "axios"

import { Modal } from "@/components/ui/modal"
import { useRestaurantModal } from "@/hooks/use-restaurant-modal"
import { 
	Form, 
	FormControl, 
	FormField, 
	FormItem,
	FormLabel,
	FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

const formSchema = z.object({
	name: z.string().min(1, "Required")
})

export const RestaurantModal = () => {
	const restaurantModal = useRestaurantModal()
	const [loading, setLoading] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: ""
		}
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		// console.log('/components/modals/restaurant-modal.tsx values: ', values)		
		try {
			setLoading(true)
			
			const resp = await axios.post("/api/restaurants", values)
			toast.success("Restaurant created successfully")

			window.location.assign(`/${resp.data.id}`)
		
		} catch (error) {
			console.log("/componenet/modals/restaurant-modal error =", error)
			toast.error("Error creating restaurant")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title="Add a new Restaurant"
			description="Restaurants are independants, lists, categories ... are not interchangeable"
			isOpen={restaurantModal.isOpen}
			onClose={restaurantModal.onClose}
		>
			<div>
				<div className="space-y-4 py-2 pb-4">
					<Form {...form} >
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField 
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input 
												disabled={loading}
												placeholder="Restaurant" 
												{...field}/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex pt-6 space-s-2 items-center justify-end">
								<Button 
									disabled={loading}
									variant={"outline"}
									onClick={restaurantModal.onClose}
								>
									Cancel</Button>

								<Button 
									disabled={loading} 
									type="submit"
								>
									Continue</Button>
								 
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	)
}