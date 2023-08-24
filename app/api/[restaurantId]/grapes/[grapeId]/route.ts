import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET(
	_req: Request, { params }: { params: { grapeId: string }}) 
{
	if (!params.grapeId) {
		return new NextResponse("Grape ID is required", { status: 401})
	}

	try {
		// const billboard = await prismadb.billboard.deleteMany({
		const grape = await prismadb.grape.findUnique({
			where: {
				id: params.grapeId,
			}
		})

		return NextResponse.json(grape)
		
	} catch (error) {
		console.log('[SIZE_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { restaurantId: string, grapeId: string} }) 
{
	const { userId } = auth()
	const body = await req.json()
	const { name } = body

	if (!userId) {
		return new NextResponse("Unauthenticated in patch", { status: 401})
	}

	if (!name) {
		return new NextResponse("Name is required in patch", { status: 401})
	}

	if (!params.grapeId) {
		return new NextResponse("Grape ID is required in patch", { status: 401})
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

		const grape = await prismadb.grape.update({
			where: {
				id: params.grapeId
			},
			data: {
				name
			}
		})

		return NextResponse.json(grape)
		
	} catch (error) {
		console.log('[SIZE_PATCH]: ', error)
		return new NextResponse("Internal POST error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE (
	_req: Request, { params }: { params: { restaurantId: string, grapeId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.grapeId) {
		return new NextResponse("Grape ID is required", { status: 401})
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

		// const billboard = await prismadb.billboard.deleteMany({
		const grape = await prismadb.grape.delete({
			where: {
				id: params.grapeId,
			}
		})

		return NextResponse.json(grape)
		
	} catch (error) {
		console.log('[GRAPE_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}