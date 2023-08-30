import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET (
	_req: Request, { params }: { params: { bierId: string }}) 
{
	if (!params.bierId) {
		return new NextResponse("Bier id is required", { status: 401 })
	}

	try {
		// const bier = await prismadb.bier.deleteMany({
		const bier = await prismadb.bier.findUnique({
			where: {
				id: params.bierId,
			},
			include: {
				category: true,
				region:		true,
				malt: 		true,
				style:		true,
				color:		true,
				formats: 	true,
				images: 	true,
			}
		})

		return NextResponse.json(bier)
		
	} catch (error) {
		console.log('[BIER_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { restaurantId: string, bierId: string} }) 
{
	const { userId } = auth()
	const body = await req.json()
	const { 
		name, 
		description,
		categoryId, 
		regionId,
		maltId,
		styleId,
		colorId,
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

	if (!regionId) {
		return new NextResponse("region ID is required in post", { status: 400})			
	}

	if (!maltId) {
		return new NextResponse("malt ID is required in post", { status: 400})			
	}

	if (!styleId) {
		return new NextResponse("style ID is required in post", { status: 400})			
	}

	if (!colorId) {
		return new NextResponse("color ID is required in post", { status: 400})			
	}

	if (!formats || !formats.length) {
		return new NextResponse("Images is required in post", { status: 400})			
	}

	if (!images || !images.length) {
		return new NextResponse("Images is required in post", { status: 400})			
	}

	if (!params.bierId) {
		return new NextResponse("Bier id is required in patch", { status: 401})
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

		await prismadb.bier.update({
			where: {
				id: params.bierId
			},
			data: {
				name, 
				description, 
				categoryId, 
				regionId,
				maltId,
				styleId,
				colorId,
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

		const bier = await prismadb.bier.update({
			where: {
				id: params.bierId
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

		return NextResponse.json(bier)
		
	} catch (error) {
		console.log('[BIER_PATCH]: ', error)
		return new NextResponse("Internal PATCH error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE (
	_req: Request, { params }: { params: { restaurantId: string, bierId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.bierId) {
		return new NextResponse("Bier id is required", { status: 401})
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

		// const bier = await prismadb.bier.deleteMany({
		const bier = await prismadb.bier.delete({
			where: {
				id: params.bierId,
			}
		})

		return NextResponse.json(bier)
		
	} catch (error) {
		console.log('[BIER_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}