import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
		req: Request
) {
	try {
		const { userId} = auth()
		const body = await req.json()
		const { name } = body

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401})			
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 401})			
		}

		const restaurant = await prismadb.restaurant.create({
			data: {
				name,
				userId
			}
		})

		return NextResponse.json(restaurant)

	}	catch (error) {
		console.log('[RESTAURANT_POST]: ', error)
		return new NextResponse("Internal error at /api/restaurants", { status: 500})		
	}
}