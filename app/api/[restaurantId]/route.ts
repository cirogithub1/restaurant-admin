import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request,
	{ params }: { params: { restaurantId: string } }
) {

	try {
		const { userId } = auth()
		const body = await req.json()

		const { name } = body

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401})
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400})
		}

		if (!params.restaurantId) {
			// console.log("app/api/restaurants/[restaurant]/route.ts", params)
			return new NextResponse("Restaurant ID is required", { status: 400})
		}

		// const restaurant = "test"
		const restaurant = await prismadb.restaurant.update({
			where: {
				id: params.restaurantId,
				userId: userId
			},
			data: {
				name: name
			}
		})

		return NextResponse.json(restaurant)
		
	} catch (error) {
		console.log('[STORE_PATCH]: ', error)
		return new NextResponse("Internal POST error", { status: 500})				
	}
}

export async function DELETE (
	// for convention _var means not used or private
	_req: Request,
	{ params }: { params: { restaurantId: string } }
) {

	try {
		const { userId } = auth()
		
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401})
		}

		if (!params.restaurantId) {
			return new NextResponse("Restaurant ID is required", { status: 400})
		}

		// const restaurant = await prismadb.restaurant.deleteMany({
		const restaurant = await prismadb.restaurant.delete({
			where: {
				id: params.restaurantId,
				userId: userId
			}
		})

		return NextResponse.json(restaurant)
		
	} catch (error) {
		console.log('[STORE_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}