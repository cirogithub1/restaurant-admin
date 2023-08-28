"use client"

import React, { useState, useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
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
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="light"
      {...props}>
        {children}
    </NextThemesProvider>
  )
}