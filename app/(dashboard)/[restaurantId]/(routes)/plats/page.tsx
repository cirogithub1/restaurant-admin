import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"

import { PlatClient } from "./components/client"
import { PlatColumn } from "./components/columns"

const PlatsPage = async ({ params }: { params: { restaurantId: string }}) => {
	const plats = await prismadb.plat.findMany({
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

	// console.log("app/(dashboard)/[restaurantId]/routes)/plats/page.tsx plats: ", plats)
	const puf = [
		{
			id: "id",
			name: "name",
			description: "description",
			category: 
			{
				name: "category"
			},
			formats: [
				{
					name: "name",
					price: 123
				},
				{
					name: "name1",
					price: 456
				},
				{
					name: "name2",
					price: 789
				},
			],
			isFeatured: 	true,
			isArchived: 	false,
			createdAt: 		Date.now()
		},
		{
			id: "id1",
			name: "name1",
			description: "description1",
			category: 
			{
				name: "category"
			},
			formats: [
				{
					name: "name",
					price: 123
				},
				{
					name: "name1",
					price: 456
				},
				{
					name: "name2",
					price: 789
				},
			],
			isFeatured: 	true,
			isArchived: 	false,
			createdAt: 		Date.now()
		}
	]

	const formattedPlats: PlatColumn[] = puf.map((item) => ({
		id: 					item.id,
		name: 				item.name,
		description: 	item.description,
		category: 		item.category.name,
		formats: 			item.formats.map((formItem) => {
			const newItem:{name: string, price: string} = {
				name: formItem.name || '{}',
				price: formatter.format(formItem.price) 
			}
			// .toNumber()

			return newItem
		}),
		isFeatured: 	item.isFeatured,
		isArchived: 	item.isArchived,
		createdAt: 		format(item.createdAt, "MMMM do yyyy")
	}))

	// console.log("app/(dashboard)/[restaurantId]/routes)/plats/page.tsx formattedPlats: ", formattedPlats)
	
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<PlatClient data={formattedPlats} /> 
			</div>
		</div>
	)
}

export default PlatsPage