import prismadb from "@/lib/prismadb"
import { RegionForm } from "./components/region-form"

const RegionPage = async ({ params }: { params: { regionId: string }}) => {
	const region = await prismadb.region.findUnique({
		where: {
			id: params.regionId
		}
	})

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<RegionForm initialData={region}/>
			</div>
		</div>
	)
}

export default RegionPage