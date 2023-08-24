"use client"

import { ComponentPropsWithoutRef, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusCircle, ChefHat } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRestaurantModal } from "@/hooks/use-restaurant-modal"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { cn } from "@/lib/utils"

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface SwitcherProps extends PopoverTriggerProps {
	items: Record<string, any>[]
}

const RestaurantSwitcher = ({ className, items = []}: SwitcherProps) => {
	const restaurantModal = useRestaurantModal()
	const params = useParams()
	const router = useRouter()

	const [open, setOpen] = useState(false)

	// Start Block for preventing rerendering on mount (hydration)
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])
	if (!isMounted) return null
	// End Block for preventing rerendering on mount (hydration)

	const formattedItems = items.map((item) => ({
		label: item.name,
		value: item.id
	}))

	const currentRestaurant = formattedItems.find((item) => item.value === params.restaurantId)

	const onRestaurantSelect = (restaurant: {value: string, label: string}) => {
		setOpen(false)
		router.push(`/${restaurant.value}`)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-expanded={open}
				aria-label="Select a restaurant"
			>
				<div 
					className="
						inline-flex w-44 h-auto px-2 py-2 justify-between items-center rounded-md border border-input text-sm font-medium ring-offset-background transition-colors bg-background hover:bg-accent hover:text-accent-foreground "
				>
					<ChefHat className="mr-2 h-6 w-6 text-yellow-400"/>

					<p>{currentRestaurant?.label}</p>

					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</div>
				{/* </Button> */}
			</PopoverTrigger>

			<PopoverContent className="w-48 p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search restaurant"/>

						<CommandEmpty>No restaurant found</CommandEmpty>

						<CommandGroup heading="Restaurant">
							{formattedItems.map((restaurant) => (
								<CommandItem
									key={restaurant.value}
									className="text-sm"
									onSelect={() => onRestaurantSelect(restaurant)}
								>
									<ChefHat className="mr-2 h-4 w-4"/>

									{restaurant.label}

									<Check 
										className={cn(`ml-auto h-4 w-4`, currentRestaurant?.value === restaurant.value ? "opacity-100" : "opacity-0")}
									/>
								</CommandItem>
							))}

						</CommandGroup>
					</CommandList>

					<CommandSeparator />

					<CommandList>
						<CommandGroup>
							<CommandItem
								className="cursor-pointer"
								onSelect={() => {
									setOpen(false),
									restaurantModal.onOpen()
								}}
							>
								<PlusCircle className="mr-2 h-4 w-4" />
								
								New Restaurant
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export default RestaurantSwitcher