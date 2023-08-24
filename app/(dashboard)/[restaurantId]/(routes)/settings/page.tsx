import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { FC } from "react"

import prismadb from "@/lib/prismadb"
import { SettingsForm } from "./components/settings-form"

interface Props {
	params: {
		restaurantId: string
	}
}

const SettingsPage: FC<Props> = async ({ params }) => {
	const { userId } = auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const restaurant = await prismadb.restaurant.findFirst({
		where: {
			id: params.restaurantId,
			userId: userId
		}
	})

	if (!restaurant) {
		redirect('/')
	}

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SettingsForm initialData={restaurant}/>
			</div>
		</div>
	)
}

export default SettingsPage