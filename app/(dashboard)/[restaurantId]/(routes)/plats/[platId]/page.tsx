import prismadb from "@/lib/prismadb"
import { PlatForm } from "./components/plat-form"

const PlatPage = async ({ params }: { params: { platId: string, restaurantId: string }}) => {
	const plat = await prismadb.plat.findUnique({
		where: {
			id: params.platId
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

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				Call Platform Component
				{/* <PlatForm 
					categories={categories}
					initialData={plat}
				/> */}
			</div>
		</div>
	)
}

export default PlatPage