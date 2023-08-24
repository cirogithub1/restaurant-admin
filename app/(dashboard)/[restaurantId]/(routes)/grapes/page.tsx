import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { GrapeClient } from "./components/client"
import { GrapeColumn } from "./components/columns"

const GrapesPage = async ({ params }: { params: { restaurantId: string }}) => {
	const grapes = await prismadb.grape.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		orderBy: {
			name: "asc"
		}
	})

	const formattedGrapes: GrapeColumn[] = grapes.map((item) => ({
		id: item.id,
		name: item.name,
		createdAt: format(item.createdAt, "MMMM do yyyy")
	}))

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<GrapeClient data={formattedGrapes} /> 
			</div>
		</div>
	)
}

export default GrapesPage