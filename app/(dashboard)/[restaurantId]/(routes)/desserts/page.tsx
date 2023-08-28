import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"

import { DessertClient } from "./components/client"
import { DessertColumn } from "./components/columns"

const DessertsPage = async ({ params }: { params: { restaurantId: string }}) => {
	const desserts = await prismadb.dessert.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		include: {
			category: true,
			formats: true
		},
		orderBy: {
			createdAt: "desc"
		}
	})

	const formattedDesserts: DessertColumn[] = desserts.map((item) => ({
		id: 					item.id,
		name: 				item.name,
		description: 	item.description,
		category: 		item.category.name,
		formats: 			item.formats.map((formatItem) => {
			const newItem:{name: string, price: string} = {
				name: formatItem.name || '{}',
				price: formatter.format(formatItem.price.toNumber()) 
			}
			return newItem
		}),
		isFeatured: 	item.isFeatured,
		isArchived: 	item.isArchived,
		createdAt: 		format(item.createdAt, "MMMM do yyyy")
	}))

	// console.log("app/(dashboard)/[restaurantId]/routes)/desserts/page.tsx formattedDesserts: ", formattedDesserts)
	
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<DessertClient data={formattedDesserts} /> 
			</div>
		</div>
	)
}

export default DessertsPage