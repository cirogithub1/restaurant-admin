import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"

import { VinClient } from "./components/client"
import { VinColumn } from "./components/columns"

const VinsPage = async ({ params }: { params: { restaurantId: string }}) => {
	const vins = await prismadb.vin.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		include: {
			category: true,
			region:		true,
			grape:		true,
			color:		true,
			formats: true
		},
		orderBy: {
			createdAt: "desc"
		}
	})

	const formattedVins: VinColumn[] = vins.map((item) => ({
		id: 					item.id,
		name: 				item.name,
		description: 	item.description,
		category: 		item.category.name,
		region: 			item.region.name,
		grape:			  item.grape.name,
		color:				item.color.name,
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

	// console.log("app/(dashboard)/[restaurantId]/routes)/vins/page.tsx formattedVins: ", formattedVins)
	
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<VinClient data={formattedVins} /> 
			</div>
		</div>
	)
}

export default VinsPage