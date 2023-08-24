import prismadb from "@/lib/prismadb"
import { GrapeForm } from "./components/grape-form"

const GrapePage = async ({ params }: { params: { grapeId: string }}) => {
	const grape = await prismadb.grape.findUnique({
		where: {
			id: params.grapeId
		}
	})

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<GrapeForm initialData={grape}/>
			</div>
		</div>
	)
}

export default GrapePage