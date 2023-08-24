import prismadb from "@/lib/prismadb"
import { FC } from "react"

interface Props {
	params: { restaurantId: string }
}

const DashboardPage: FC<Props> = async ({ params }) => {
	const restaurant = await prismadb.restaurant.findFirst({
		where: {
			id: params.restaurantId
		}
	})

	return (  
		<h1>
		This is the Overview of the Restaurant: 

		{restaurant &&
			<p>{restaurant.name}</p>
		}
	</h1> 

	)
}
 
export default DashboardPage