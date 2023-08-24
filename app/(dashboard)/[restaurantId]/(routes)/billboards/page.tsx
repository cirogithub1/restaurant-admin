import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { BillboardClient } from "./components/client"
import { BillboardColumn } from "./components/columns"

const BillboardsPage = async ({ params }: { params: { restaurantId: string }}) => {
	const billboards = await prismadb.billboard.findMany({
		where: {
			restaurantId: params.restaurantId
		},
		orderBy: {
			name: "asc"
		}
	})

	const formattedBillvoards: BillboardColumn[] = billboards.map((item) => ({
		id: item.id,
		name: item.name,
		createdAt: format(item.createdAt, "MMMM do yyyy")
	}))

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<BillboardClient data={formattedBillvoards} /> 
			</div>
		</div>
	)
}

export default BillboardsPage