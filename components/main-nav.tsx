"use client"

import { HTMLAttributes } from "react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"

import { cn } from "@/lib/utils"

export const MainNav = ({
	className,
	...props
}: HTMLAttributes<HTMLElement>) => {
	const pathname = usePathname()
	const params = useParams()

	const routes = [
		{
			href: `/${params.restaurantId}`,
			label: 'Overview',
			active: pathname === `/${params.restaurantId}`
		},
		{
			href: `/${params.restaurantId}/billboards`,
			label: 'Billboards',
			active: pathname === `/${params.restaurantId}/billboards`
		},
		{
			href: `/${params.restaurantId}/categories`,
			label: 'Categories',
			active: pathname === `/${params.restaurantId}/categories`
		},
		{
			href: `/${params.restaurantId}/regions`,
			label: 'Regions',
			active: pathname === `/${params.restaurantId}/regions`
		},
		{
			href: `/${params.restaurantId}/colors`,
			label: 'Colors',
			active: pathname === `/${params.restaurantId}/colors`
		},
		{
			href: `/${params.restaurantId}/grapes`,
			label: 'Grapes',
			active: pathname === `/${params.restaurantId}/grapes`
		},
		{
			href: `/${params.restaurantId}/styles`,
			label: 'Styles',
			active: pathname === `/${params.restaurantId}/styles`
		},
		{
			href: `/${params.restaurantId}/plats`,
			label: 'Plats',
			active: pathname === `/${params.restaurantId}/plats`
		},
		{
			href: `/${params.restaurantId}/desserts`,
			label: 'Desserts',
			active: pathname === `/${params.restaurantId}/desserts`
		},
		{
			href: `/${params.restaurantId}/vins`,
			label: 'Vins',
			active: pathname === `/${params.restaurantId}/vins`
		},
		{
			href: `/${params.restaurantId}/biers`,
			label: 'Biers',
			active: pathname === `/${params.restaurantId}/biers`
		},
		{
			href: `/${params.restaurantId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.restaurantId}/settings`
		},
	]
	
	return (
		<nav
			className={cn(`flex items-center space-x-4 lg:space-x-6`, className)}
		>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(`
						text-sm font-medium transition-colors hover:text-primary`, 
						route.active ? 
							"text-blue-300 font-bold dark:text-white" : 
							"text-muted-foreground"
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	)
}