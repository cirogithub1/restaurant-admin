import { ReactNode } from "react";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function SetupLayout({ children }: { children: ReactNode }) {
	const { userId } = auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const restaurant = await prismadb.restaurant.findFirst({
		where: {
			userId: userId
		}
	})

	if (restaurant) {
		redirect(`/${restaurant.id}`)
	}

	return (
		<>
			{children}
		</>
	)
}