import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (req: Request, { params }: { params: { restaurantId: string }}) {
	const { userId} = auth()
	const body = await req.json()

	const { name } = body

	if (!userId) {
		return new NextResponse("Unauthenticated", { status: 401})			
	}

	if (!name) {
		return new NextResponse("Name is required in post", { status: 401})			
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
			return new NextResponse("User unauthorized to create this grape", { status: 403 })			
		}

		const grape = await prismadb.grape.create({
			data: {
				name: name,
				restaurantId: params.restaurantId
			}
		})

		return NextResponse.json(grape)

	}	catch (error) {
		console.log('[SIZES_POST]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}

export async function GET (req: Request, { params }: { params: { restaurantId: string }}) {
	if (!params.restaurantId) {
		return new NextResponse("StoreId is required as path params", { status: 401})			
	}

	try {
		const grapes = await prismadb.grape.findMany({
			where: {
				restaurantId: params.restaurantId
			}
		})

		return NextResponse.json(grapes)

	}	catch (error) {
		console.log('[SIZES_GET]: ', error)
		return new NextResponse("Internal error", { status: 500})		
	}
}