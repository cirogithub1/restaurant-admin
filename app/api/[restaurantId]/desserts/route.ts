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
			return new NextResponse("User unauthorized to create this dessert", { status: 403 })			
		}

		const dessert = await prismadb.dessert.create({
			data: {
				name, 
				description, 
				categoryId, 
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

		return NextResponse.json(dessert)

	}	catch (error) {
		console.log('[DESSERTS_POST]: ', error)
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
		const desserts = await prismadb.dessert.findMany({
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

		return NextResponse.json(desserts)

	}	catch (error) {
		console.log('[DESSERTS_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}