"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Address {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  name: string
  last4?: string
  expiryDate?: string
  isDefault: boolean
}

interface Order {
  id: string
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image?: string
  }[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  orders: Order[]
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  addAddress: (address: Omit<Address, "id">) => void
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data for demonstration
const mockUser: User = {
  id: "user1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=200&width=200",
}

const mockAddresses: Address[] = [
  {
    id: "addr1",
    name: "Home",
    line1: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    isDefault: true,
  },
  {
    id: "addr2",
    name: "Work",
    line1: "456 Business Ave",
    line2: "Suite 500",
    city: "New York",
    state: "NY",
    postalCode: "10002",
    country: "United States",
    isDefault: false,
  },
]

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm1",
    type: "card",
    name: "Visa ending in 4242",
    last4: "4242",
    expiryDate: "12/25",
    isDefault: true,
  },
  {
    id: "pm2",
    type: "paypal",
    name: "PayPal - john.doe@example.com",
    isDefault: false,
  },
]

const mockOrders: Order[] = [
  {
    id: "ord1",
    date: "2025-03-10T14:30:00Z",
    total: 124.95,
    status: "delivered",
    items: [
      {
        id: "headphones",
        name: "Headphones",
        quantity: 1,
        price: 59.99,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "bluetooth-speaker",
        name: "Bluetooth Speaker",
        quantity: 1,
        price: 49.99,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  {
    id: "ord2",
    date: "2025-03-05T10:15:00Z",
    total: 39.98,
    status: "shipped",
    items: [
      {
        id: "coffee-mug",
        name: "Coffee Mug",
        quantity: 2,
        price: 12.99,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "notebook",
        name: "Notebook",
        quantity: 3,
        price: 4.99,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setAddresses(mockAddresses)
        setPaymentMethods(mockPaymentMethods)
        setOrders(mockOrders)
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would validate credentials with your backend
    if (email && password) {
      setUser(mockUser)
      setAddresses(mockAddresses)
      setPaymentMethods(mockPaymentMethods)
      setOrders(mockOrders)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } else {
      throw new Error("Invalid credentials")
    }

    setIsLoading(false)
  }

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would register the user with your backend
    if (name && email && password) {
      const newUser = { ...mockUser, name, email }
      setUser(newUser)
      setAddresses([])
      setPaymentMethods([])
      setOrders([])
      localStorage.setItem("user", JSON.stringify(newUser))
    } else {
      throw new Error("Invalid registration data")
    }

    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    setAddresses([])
    setPaymentMethods([])
    setOrders([])
    localStorage.removeItem("user")
    // Don't clear cart data to allow browsing products after logout
  }

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress: Address = {
      ...address,
      id: `addr${Date.now()}`,
    }

    // If this is the first address or marked as default, update other addresses
    let updatedAddresses = [...addresses]
    if (newAddress.isDefault || addresses.length === 0) {
      updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }))
    }

    setAddresses([...updatedAddresses, newAddress])
  }

  const addPaymentMethod = (method: Omit<PaymentMethod, "id">) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm${Date.now()}`,
    }

    // If this is the first payment method or marked as default, update other methods
    let updatedMethods = [...paymentMethods]
    if (newMethod.isDefault || paymentMethods.length === 0) {
      updatedMethods = paymentMethods.map((method) => ({
        ...method,
        isDefault: false,
      }))
    }

    setPaymentMethods([...updatedMethods, newMethod])
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        addresses,
        paymentMethods,
        orders,
        login,
        register,
        logout,
        addAddress,
        addPaymentMethod,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

