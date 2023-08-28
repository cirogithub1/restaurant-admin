import prismadb from "@/lib/prismadb"
import { BierForm } from "./components/bier-form"

const BierPage = async ({ params }: { params: { bierId: string, restaurantId: string }}) => {
	const bier = await prismadb.bier.findUnique({
		where: {
			id: params.bierId
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

	const malts = await prismadb.malt.findMany({
		where: {
			restaurantId: params.restaurantId
		}
	})

	const styles = await prismadb.style.findMany({
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
				<BierForm 
					categories={categories}
					regions={regions}
					malts={malts}
					styles={styles}
					colors={colors}
					initialData={bier}
				/>
			</div>
		</div>
	)
}

export default BierPage