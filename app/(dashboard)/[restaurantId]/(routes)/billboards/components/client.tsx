"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { FC } from "react"
import { BillboardColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface Props {
	data: BillboardColumn[]
}
export const BillboardClient: FC<Props> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	return (
		<>
			<div className="flex items-center justify-between"> 
				<Heading 
					title={`Billboards (${data.length})`}
					description="Manage billboards"
				/>

				<Button onClick={() => router.push(`/${params.restaurantId}/billboards/new`)}>
					<Plus className="mr-2 h-4 w-4"/>
					
					Add New
				</Button>
			</div>

			<Separator />

			<DataTable columns={columns} data={data} searchKey="name"/>

			<Heading 
				title="API"
				description="API calls for Billboard"
			/>

			<Separator />

			<ApiList entityName="billboards" entityId="billboardId"/>
		</>
	)
}
