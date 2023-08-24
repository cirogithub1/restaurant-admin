import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// for convention _var means not used or private
export async function GET(
	_req: Request, { params }: { params: { styleId: string }}) 
{
	if (!params.styleId) {
		return new NextResponse("Style ID is required", { status: 401})
	}

	try {
		// const billboard = await prismadb.billboard.deleteMany({
		const style = await prismadb.style.findUnique({
			where: {
				id: params.styleId,
			}
		})

		return NextResponse.json(style)
		
	} catch (error) {
		console.log('[SIZE_GET]: ', error)
		return new NextResponse("Internal GET error", { status: 500})				
	}
}

// Why PATCH instead of PUT?:  
// https://medium.com/@9cv9official/what-are-get-post-put-patch-delete-a-walkthrough-with-javascripts-fetch-api-17be31755d28
export async function PATCH (
	req: Request, { params }: { params: { restaurantId: string, styleId: string} }) 
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

	if (!params.styleId) {
		return new NextResponse("Style ID is required in patch", { status: 401})
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

		const style = await prismadb.style.update({
			where: {
				id: params.styleId
			},
			data: {
				name
			}
		})

		return NextResponse.json(style)
		
	} catch (error) {
		console.log('[SIZE_PATCH]: ', error)
		return new NextResponse("Internal POST error", { status: 500})				
	}
}

// for convention _var means not used or private
export async function DELETE(
	_req: Request, { params }: { params: { restaurantId: string, styleId: string }}) 
{
	const { userId } = auth()
	
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401})
	}

	if (!params.styleId) {
		return new NextResponse("Style ID is required", { status: 401})
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
		const style = await prismadb.style.delete({
			where: {
				id: params.styleId,
			}
		})

		return NextResponse.json(style)
		
	} catch (error) {
		console.log('[STYLE_DELETE]: ', error)
		return new NextResponse("Internal DELETE error", { status: 500})				
	}
}