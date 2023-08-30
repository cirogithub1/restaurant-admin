import prismadb from "@/lib/prismadb"
import { MaltForm } from "./components/malt-form"

const MaltPage = async ({ params }: { params: { maltId: string }}) => {
	const malt = await prismadb.malt.findUnique({
		where: {
			id: params.maltId
		}
	})

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<MaltForm initialData={malt}/>
			</div>
		</div>
	)
}

export default MaltPage