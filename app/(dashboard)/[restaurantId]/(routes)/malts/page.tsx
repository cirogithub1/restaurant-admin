import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { MaltClient } from "./components/client"
import { MaltColumn } from "./components/columns"

const MaltsPage = async ({ params }: { params: { restaurantId: string }}) => {
	const malts = await prismadb.malt.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		orderBy: {
			name: "asc"
		}
	})

	const formattedMalts: MaltColumn[] = malts.map((item) => ({
		id: item.id,
		name: item.name,
		createdAt: format(item.createdAt, "MMMM do yyyy")
	}))

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<MaltClient data={formattedMalts} /> 
			</div>
		</div>
	)
}

export default MaltsPage