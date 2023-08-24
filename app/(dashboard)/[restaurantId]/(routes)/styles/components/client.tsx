"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { FC } from "react"
import { StyleColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface Props {
	data: StyleColumn[]
}
export const StyleClient: FC<Props> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	return (
		<>
			<div className="flex items-center justify-between"> 
				<Heading 
					title={`Styles (${data.length})`}
					description="Manage Styles"
				/>

				<Button onClick={() => router.push(`/${params.restaurantId}/styles/new`)}>
					<Plus className="mr-2 h-4 w-4"/>
					
					Add New
				</Button>
			</div>

			<Separator />

			<DataTable searchKey="name" columns={columns} data={data} />

			<Heading 
				title="API"
				description="API calls for Styles"
			/>

			<Separator />

			<ApiList entityName="styles" entityId="styleId"/>
		</>
	)
}
