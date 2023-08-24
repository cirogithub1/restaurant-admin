import { UserButton, auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { MainNav } from "@/components/main-nav"
import RestaurantSwitcher from "@/components/restaurant-switcher"
import prismadb from "@/lib/prismadb"
import { ThemeToggle } from "@/components/theme-toggle"

const Navbar = async () => {
	const { userId } = auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const restaurants = await prismadb.restaurant.findMany({
		where: {
			userId
		}
	})

	return (
		<div className="border-b">
			<div className="flex items-center h-16 px-4">
				<RestaurantSwitcher items={restaurants}/> {/* the hydration problems comes from here */}

				{restaurants.length > 0 &&
					<MainNav className="mx-6"/>
				}
				<div className="flex ml-auto items-center space-x-4">
					<ThemeToggle />
					
					<UserButton afterSignOutUrl="/" />
				</div>
			</div>
		</div>
	)
}

export default Navbar