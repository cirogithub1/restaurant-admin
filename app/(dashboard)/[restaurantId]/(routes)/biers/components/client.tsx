"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { FC } from "react"
import { BierColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface Props {
	data: BierColumn[]
}
export const BierClient: FC<Props> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	return (
		<>
			<div className="flex items-center justify-between"> 
				<Heading 
					title={`Biers (${data.length})`}
					description="Manage biers"
				/>

				<Button onClick={() => router.push(`/${params.restaurantId}/biers/new`)}>
					<Plus className="mr-2 h-4 w-4"/>
					
					Add New
				</Button>
			</div>

			<Separator />

			<DataTable columns={columns} data={data} searchKey="name"/>

			<Heading 
				title="API"
				description="API calls for Bier"
			/>

			<Separator />

			<ApiList entityName="biers" entityId="bierId"/>
		</>
	)
}
