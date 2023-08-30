import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (req: Request, { params }: { params: { restaurantId: string }}) {
	const { userId} = auth()
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
		return new NextResponse("Unauthenticated", { status: 401})			
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
		return new NextResponse("Formatsis required in post", { status: 400})			
	}

	if (!images || !images.length) {
		return new NextResponse("Images is required in post", { status: 400})			
	}

	if (!params.restaurantId) {
		return new NextResponse("RestaurantId is required as path params in post", { status: 400})			
	}

	try {
		const restaurantByUserId = await prismadb.restaurant.findFirst({
			where: {
				id: params.restaurantId,
				userId
			}
		})

		if (!restaurantByUserId) {
			return new NextResponse("User unauthorized to create this bier", { status: 403 })			
		}

		const bier = await prismadb.bier.create({
			data: {
				name, 
				description, 
				categoryId, 
				regionId,
				maltId,
				styleId,
				colorId,
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
				}, 
				isFeatured, 
				isArchived,
				restaurantId: params.restaurantId
			}
		})

		return NextResponse.json(bier)

	}	catch (error) {
		console.log('[BIERS_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET (req: Request, { params }: { params: { restaurantId: string }}) {
	const { searchParams } = new URL(req.url)
	
	const categoryId = searchParams.get('categoryId') || undefined
	const isFeatured = searchParams.get('isFeatured')
	
	if (!params.restaurantId) {
		return new NextResponse("RestaurantId is required as path params", { status: 401})			
	}

	try {
		const biers = await prismadb.bier.findMany({
			where: {
				restaurantId: params.restaurantId,
				categoryId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false
			},
			include: {
				category: true,
				formats: true,
				images: true,
			},
			orderBy: {
				name: "asc"
			}
		})

		return NextResponse.json(biers)

	}	catch (error) {
		console.log('[BIERS_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}