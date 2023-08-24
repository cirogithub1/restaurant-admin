import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (req: Request, { params }: { params: { restaurantId: string }}) {
	const { userId} = auth()
	const body = await req.json()
	const { name, imageUrl } = body

	if (!userId) {
		return new NextResponse("Unauthenticated", { status: 401})			
	}

	if (!name) {
		return new NextResponse("Billboerd name is required in post", { status: 401})			
	}

	if (!imageUrl) {
		return new NextResponse("Image URL is required in post", { status: 401})			
	}

	if (!params.restaurantId) {
		return new NextResponse("StoreId is required as path params in post", { status: 401})			
	}

	try {
		const restaurantByUserId = await prismadb.restaurant.findFirst({
			where: {
				id: params.restaurantId,
				userId
			}
		})

		if (!restaurantByUserId) {
			return new NextResponse("User unauthorized to create this billboard", { status: 403 })			
		}

		const billboard = await prismadb.billboard.create({
			data: {
				name: name,
				imageUrl: imageUrl,
				restaurantId: params.restaurantId
			}
		})

		return NextResponse.json(billboard)

	}	catch (error) {
		console.log('[BILLBOARDS_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET (req: Request, { params }: { params: { restaurantId: string }}) {
	if (!params.restaurantId) {
		return new NextResponse("StoreId is required as path params", { status: 401})			
	}

	try {
		const billboards = await prismadb.billboard.findMany({
			where: {
				restaurantId: params.restaurantId
			}
		})

		return NextResponse.json(billboards)

	}	catch (error) {
		console.log('[BILLBOARDS_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}