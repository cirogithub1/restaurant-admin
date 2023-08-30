import prismadb from "@/lib/prismadb"
import { VinForm } from "./components/vin-form"

const VinPage = async ({ params }: { params: { vinId: string, restaurantId: string }}) => {
	const vin = await prismadb.vin.findUnique({
		where: {
			id: params.vinId
		},
		include: {
			images: true,
			formats: true
		}
	})

	const categories = await prismadb.category.findMany({
		where: {
			restaurantId: params.restaurantId
		}
	})

	const regions = await prismadb.region.findMany({
		where: {
			restaurantId: params.restaurantId
		}
	})

	const grapes = await prismadb.grape.findMany({
		where: {
			restaurantId: params.restaurantId
		}
	})

	const colors = await prismadb.color.findMany({
		where: {
			restaurantId: params.restaurantId
		}
	})

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<VinForm 
					categories={categories}
					regions={regions}
					grapes={grapes}
					colors={colors}
					initialData={vin}
				/>
			</div>
		</div>
	)
}

export default VinPage