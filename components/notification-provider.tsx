"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type Notification = {
  id: string
  title: string
  description: string
  type: "success" | "error" | "info" | "warning"
  read: boolean
}

type NotificationContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "read">) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  markAsRead: () => {},
  clearNotifications: () => {},
  unreadCount: 0,
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  const addNotification = (notification: Omit<Notification, "id" | "read">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification = { ...notification, id, read: false }

    setNotifications((prev) => [newNotification, ...prev])

    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.description,
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
