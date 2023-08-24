"use client"

import { useRestaurantModal } from "@/hooks/use-restaurant-modal"
import { useEffect } from "react"

const SetupPage = () => {
  const onOpen = useRestaurantModal((state) => state.onOpen)
  const isOpen = useRestaurantModal((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])  

  return (
    <div className="p-4">
      Root
    </div>
  )
}

export default SetupPage