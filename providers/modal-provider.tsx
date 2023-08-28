"use client"

import { useState, useEffect } from "react"

import { RestaurantModal } from "@/components/modals/restaurant-modal"

export const ModalProvider = () => {

	// Start Preventing the modal from being mounted on the server
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])	
	if (!isMounted) {
		return null
	} 
	// End Preventing the modal from being mounted on the server

	return (
		<>
			<RestaurantModal />
		</>
	)
	
}