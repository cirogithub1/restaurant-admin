import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { RegionClient } from "./components/client"
import { RegionColumn } from "./components/columns"

const RegionsPage = async ({ params }: { params: { restaurantId: string }}) => {
	const regions = await prismadb.region.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		orderBy: {
			name: "asc"
		}
	})

	const formattedRegions: RegionColumn[] = regions.map((item) => ({
		id: item.id,
		name: item.name,
		createdAt: format(item.createdAt, "MMMM do yyyy")
	}))

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<RegionClient data={formattedRegions} /> 
			</div>
		</div>
	)
}

export default RegionsPage