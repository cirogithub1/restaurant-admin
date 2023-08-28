import prismadb from "@/lib/prismadb"
import { DessertForm } from "./components/dessert-form"

const DessertPage = async ({ params }: { params: { dessertId: string, restaurantId: string }}) => {
	const dessert = await prismadb.dessert.findUnique({
		where: {
			id: params.dessertId
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
				<DessertForm 
					categories={categories}
					initialData={dessert}
				/>
			</div>
		</div>
	)
}

export default DessertPage