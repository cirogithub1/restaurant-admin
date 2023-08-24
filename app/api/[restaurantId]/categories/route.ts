import { Billboard, Category } from '@prisma/client';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { restaurantId: string }}) {
	const { userId} = auth()
	const body = await req.json()
	const { name, billboardId } = body

	if (!userId) {
		return new NextResponse("Unauthenticated", { status: 401})			
	}

	if (!name) {
		return new NextResponse("Name is required in post", { status: 401})			
	}

	if (!billboardId) {
		return new NextResponse("Billboard ID is required in post", { status: 401})			
	}

	if (!params.restaurantId) {
		return new NextResponse("RestaurantId is required as path params in post", { status: 401})			
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

		const category = await prismadb.category.create({
			data: {
				name: name,
				billboardId: billboardId,
				restaurantId: params.restaurantId
			}
		})
		// console.log('app/api/[restaurantId]/categories/route.ts', category);

		return NextResponse.json(category)

	}	catch (error) {
		console.log('[CATEGORIES_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET(req: Request, { params }: { params: { restaurantId: string }}) {
	if (!params.restaurantId) {
		return new NextResponse("RestaurantId is required as path params", { status: 401})			
	}

	try {
		const categories = await prismadb.category.findMany({
			where: {
				restaurantId: params.restaurantId
			},
			orderBy: {
				name: 'desc',
			},
		})

		return NextResponse.json(categories)

	}	catch (error) {
		console.log('[CATEGORIES_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}