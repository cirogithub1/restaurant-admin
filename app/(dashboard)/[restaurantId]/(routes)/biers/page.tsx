import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"

import { BierClient } from "./components/client"
import { BierColumn } from "./components/columns"

const BiersPage = async ({ params }: { params: { restaurantId: string }}) => {
	const biers = await prismadb.bier.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		include: {
			category: true,
			region:		true,
			malt:			true,
			style:		true,
			color:		true,
			formats: true
		},
		orderBy: {
			createdAt: "desc"
		}
	})

	const formattedBiers: BierColumn[] = biers.map((item) => ({
		id: 					item.id,
		name: 				item.name,
		description: 	item.description,
		category: 		item.category.name,
		region: 			item.region.name,
		malt:					item.malt.name,
		style:				item.style.name,
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

	// console.log("app/(dashboard)/[restaurantId]/routes)/biers/page.tsx formattedBiers: ", formattedBiers)
	
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<BierClient data={formattedBiers} /> 
			</div>
		</div>
	)
}

export default BiersPage