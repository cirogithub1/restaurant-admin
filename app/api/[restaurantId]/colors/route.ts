import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (req: Request, { params }: { params: { restaurantId: string }}) {
	const { userId} = auth()
	const body = await req.json()
	const { name, value } = body

	if (!userId) {
		return new NextResponse("Unauthenticated", { status: 401})			
	}

	if (!name) {
		return new NextResponse("Name is required in post", { status: 401})			
	}

	if (!value) {
		return new NextResponse("Value is required in post", { status: 401})			
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
			return new NextResponse("User unauthorized to create this color", { status: 403 })			
		}

		const color = await prismadb.color.create({
			data: {
				name: name,
				value: value,
				restaurantId: params.restaurantId
			}
		})

		return NextResponse.json(color)

	}	catch (error) {
		console.log('[COLORS_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET(req: Request, { params }: { params: { restaurantId: string }}) {
	if (!params.restaurantId) {
		return new NextResponse("RestaurantId is required as path params", { status: 401})			
	}

	try {
		const colors = await prismadb.color.findMany({
			where: {
				restaurantId: params.restaurantId
			}
		})

		return NextResponse.json(colors)

	}	catch (error) {
		console.log('[COLORS_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}