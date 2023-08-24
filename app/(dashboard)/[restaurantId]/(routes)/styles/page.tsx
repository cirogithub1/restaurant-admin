import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { StyleClient } from "./components/client"
import { StyleColumn } from "./components/columns"

const StylesPage = async ({ params }: { params: { restaurantId: string }}) => {
	const styles = await prismadb.style.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		orderBy: {
			name: "asc"
		}
	})

	const formattedStyles: StyleColumn[] = styles.map((item) => ({
		id: item.id,
		name: item.name,
		createdAt: format(item.createdAt, "MMMM do yyyy")
	}))

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<StyleClient data={formattedStyles} /> 
			</div>
		</div>
	)
}

export default StylesPage