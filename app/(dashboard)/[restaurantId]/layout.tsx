// import Navbar from "@/components/navbar"
import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import Navbar from "@/components/navbar"

export default async function DashboardLayout({
	children,	params }: {	children: React.ReactNode,	params: { restaurantId: string }
}) {
	const { userId } = auth()

	if (!userId) {
		redirect("/sign-in")
	}

	if (!params.restaurantId) {
		redirect('/')
	}

	try {
		const Restaurant = await prismadb.restaurant.findFirst({
			where: {
				id: params.restaurantId,
				userId: userId
			}
		})

		if (!Restaurant) {
			redirect('/')		
		}
				
	} catch (error) {
		console.log('/app/(dashboard)/[restaurantId]/layout.tsxerror: ', error)
		redirect('/')
	} 

	return (
		<>
			<Navbar />
			
			{children}
		</>
	)
}