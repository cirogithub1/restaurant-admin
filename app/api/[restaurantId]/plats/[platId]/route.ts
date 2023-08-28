import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET (
	_req: Request, { params }: { params: { platId: string }}) 
{
	if (!params.platId) {
		return new NextResponse("Plat id is required", { status: 401 })
	}

	try {
		// const plat = await prismadb.plat.deleteMany({
		const plat = await prismadb.plat.findUnique({
			where: {
				id: params.platId,
			},
			include: {
				category: true,
				formats: true,
				images: true,
			}
		})

		return NextResponse.json(plat)
		
	} catch (error) {
		console.log('[PLAT_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { restaurantId: string, platId: string} }) 
{
	const { userId } = auth()
	const body = await req.json()
	const { 
		name, 
		description,
		categoryId, 
		formats,
		images, 
		isFeatured, 
		isArchived } = body

	if (!userId) {
		return new NextResponse("Unauthenticated in patch", { status: 401})
	}
	
	if (!name) {
		return new NextResponse("Name is required in post", { status: 400})			
	}
	
	if (!description) {
		return new NextResponse("Description is required in post", { status: 400})			
	}

	if (!categoryId) {
		return new NextResponse("Category ID is required in post", { status: 400})			
	}

	if (!formats || !formats.length) {
		return new NextResponse("Images is required in post", { status: 400})			
	}

	if (!images || !images.length) {
		return new NextResponse("Images is required in post", { status: 400})			
	}

	if (!params.platId) {
		return new NextResponse("Plat id is required in patch", { status: 401})
	}

	try {
		const restaurantByUserId = await prismadb.restaurant.findFirst({
			where: {
				id: params.restaurantId,
				userId
			}
		})

		if (!restaurantByUserId) {
			return new NextResponse("Unauthorized", { status: 403})
		}

		await prismadb.plat.update({
			where: {
				id: params.platId
			},
			data: {
				name, 
				description, 
				categoryId, 
				formats: {
					deleteMany: {}
				}, 
				images: {
					deleteMany: {}
				}, 
				isFeatured, 
				isArchived
			}
		})

		const plat = await prismadb.plat.update({
			where: {
				id: params.platId
			},
			data: {
				formats: {
					createMany: {
						data: [
							...formats.map((format: {name: string, price: number}) => format)
						]
					}
				},
				images: {
					createMany: {
						data: [
							...images.map((image: {url: string}) => image)
						]
					}
				}
			}
		})

		return NextResponse.json(plat)
		
	} catch (error) {
		console.log('[PLAT_PATCH]: ', error)
		return new NextResponse("Internal PATCH error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE (
	_req: Request, { params }: { params: { restaurantId: string, platId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.platId) {
		return new NextResponse("Plat id is required", { status: 401})
	}

	try {
		const restaurantByUserId = await prismadb.restaurant.findFirst({
			where: {
				id: params.restaurantId,
				userId
			}
		})

		if (!restaurantByUserId) {
			return new NextResponse("Unauthorized", { status: 403})
		}

		// const plat = await prismadb.plat.deleteMany({
		const plat = await prismadb.plat.delete({
			where: {
				id: params.platId,
			}
		})

		return NextResponse.json(plat)
		
	} catch (error) {
		console.log('[PLAT_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}