import prismadb from "@/lib/prismadb"
import { StyleForm } from "./components/style-form"

const StylePage = async ({ params }: { params: { styleId: string }}) => {
	const style = await prismadb.style.findUnique({
		where: {
			id: params.styleId
		}
	})

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<StyleForm initialData={style}/>
			</div>
		</div>
	)
}

export default StylePage