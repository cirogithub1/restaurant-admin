"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { FC } from "react"
import { GrapeColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface Props {
	data: GrapeColumn[]
}
export const GrapeClient: FC<Props> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	return (
		<>
			<div className="flex items-center justify-between"> 
				<Heading 
					title={`Grapes (${data.length})`}
					description="Manage Grapes"
				/>

				<Button onClick={() => router.push(`/${params.restaurantId}/grapes/new`)}>
					<Plus className="mr-2 h-4 w-4"/>
					
					Add New
				</Button>
			</div>

			<Separator />

			<DataTable searchKey="name" columns={columns} data={data} />

			<Heading 
				title="API"
				description="API calls for Grapes"
			/>

			<Separator />

			<ApiList entityName="grapes" entityId="grapeId"/>
		</>
	)
}
