"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import StoreLayout from "@/components/store-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, CreditCard, MapPin, CheckCircle2, Clock, ShoppingCart } from "lucide-react"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, orders } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Find the specific order
  useEffect(() => {
    if (orders.length > 0) {
      const foundOrder = orders.find((o) => o.id === params.id)
      setOrder(foundOrder || null)
      setLoading(false)
    } else if (!isLoading) {
      setLoading(false)
    }
  }, [orders, params.id, isLoading])

  if (isLoading || loading) {
    return (
      <StoreLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        </div>
      </StoreLayout>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Will redirect to login
  }

  if (!order) {
    return (
      <StoreLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
            <h1 className="text-2xl font-bold">Order Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium mb-2">We couldn't find this order</h2>
              <p className="text-muted-foreground mb-6">
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button asChild className="bg-purple-700 hover:bg-purple-800">
                <Link href="/account/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </StoreLayout>
    )
  }

  // Format date
  const orderDate = new Date(order.date)
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = orderDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Calculate subtotal
  const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  const tax = order.total - subtotal - 5.99 // Assuming $5.99 shipping

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle2 className="h-5 w-5" />
      case "cancelled":
        return <ShoppingCart className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  // Mock shipping address and payment method
  const shippingAddress = {
    name: "John Doe",
    line1: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
  }

  const paymentMethod = {
    type: "card",
    name: "Visa ending in 4242",
    last4: "4242",
  }

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Order #{order.id}</h1>
              <p className="text-muted-foreground">
                Placed on {formattedDate} at {formattedTime}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </Badge>
              <Button variant="outline" size="sm">
                Need Help?
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items.reduce((total: number, item: any) => total + item.quantity, 0)} items in your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=80&width=80"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="mt-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-purple-700">
                            Buy Again
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-purple-700">
                            Write a Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
                <CardDescription>Track your order status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-8">
                    <TimelineItem
                      title="Order Delivered"
                      date={order.status === "delivered" ? "March 15, 2025" : null}
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      isCompleted={order.status === "delivered"}
                      description="Your order has been delivered."
                    />

                    <TimelineItem
                      title="Order Shipped"
                      date={order.status === "shipped" || order.status === "delivered" ? "March 12, 2025" : null}
                      icon={<Truck className="h-5 w-5" />}
                      isCompleted={order.status === "shipped" || order.status === "delivered"}
                      description="Your order has been shipped. Tracking number: TRK12345678"
                    />

                    <TimelineItem
                      title="Order Processing"
                      date={order.status !== "pending" ? "March 11, 2025" : null}
                      icon={<Package className="h-5 w-5" />}
                      isCompleted={order.status !== "pending"}
                      description="We're preparing your order for shipment."
                    />

                    <TimelineItem
                      title="Order Placed"
                      date={formattedDate}
                      icon={<ShoppingCart className="h-5 w-5" />}
                      isCompleted={true}
                      description="Your order has been received and is being reviewed."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$5.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    Shipping Address
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{shippingAddress.name}</p>
                  <p>{shippingAddress.line1}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    Payment Method
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{paymentMethod.name}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-900">Buy Again</Button>
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}>
      {children}
    </span>
  )
}

function TimelineItem({
  title,
  date,
  icon,
  isCompleted,
  description,
}: {
  title: string
  date: string | null
  icon: React.ReactNode
  isCompleted: boolean
  description: string
}) {
  return (
    <div className="relative pl-10">
      <div
        className={`absolute left-0 rounded-full w-8 h-8 flex items-center justify-center ${isCompleted ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"
          }`}
      >
        {icon}
      </div>
      <div>
        <div className="flex items-center">
          <h3 className={`font-medium ${isCompleted ? "" : "text-muted-foreground"}`}>{title}</h3>
          {date && <span className="ml-2 text-xs text-muted-foreground">{date}</span>}
        </div>
        {isCompleted && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

