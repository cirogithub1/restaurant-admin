"use client"

import { FC } from "react"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { ColorColumn, columns } from "./columns"

interface Props {
	data: ColorColumn[]
}
export const ColorClient: FC<Props> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	return (
		<>
			<div className="flex items-center justify-between"> 
				<Heading 
					title={`Colors (${data.length})`}
					description="Manage Colors"
				/>

				<Button onClick={() => router.push(`/${params.restaurantId}/colors/new`)}>
					<Plus className="mr-2 h-4 w-4"/>
					
					Add New
				</Button>
			</div>

			<Separator />

			<DataTable searchKey="name" columns={columns} data={data} />

			<Heading 
				title="API"
				description="API calls for Colors"
			/>

			<Separator />

			<ApiList entityName="colors" entityId="colorId"/>
		</>
	)
}
