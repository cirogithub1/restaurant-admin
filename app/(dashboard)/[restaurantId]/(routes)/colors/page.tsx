import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { ColorClient } from "./components/client"
import { ColorColumn } from "./components/columns"

const ColorsPage = async ({ params }: { params: { restaurantId: string }}) => {
	const colors = await prismadb.color.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		orderBy: {
			name: "asc"
		}
	})

	const formattedSizes: ColorColumn[] = colors.map((item) => ({
		id: item.id,
		name: item.name,
		value: item.value,
		createdAt: format(item.createdAt, "MMMM do yyyy")
	}))

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ColorClient data={formattedSizes} /> 
			</div>
		</div>
	)
}

export default ColorsPage