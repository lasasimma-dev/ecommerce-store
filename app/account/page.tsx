"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import StoreLayout from "@/components/store-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Package, MapPin, CreditCard, Settings, ShoppingBag } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, orders } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
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

  const recentOrders = orders.slice(0, 3)

  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl bg-purple-200 text-purple-700">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/account/settings">Edit Profile</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/account/addresses">Manage Addresses</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/account/payment-methods">Payment Methods</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Order</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.length > 0 ? new Date(orders[0].date).toLocaleDateString() : "No orders"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Addresses</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your most recent purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.total.toFixed(2)}</p>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={item.image} alt={item.name} />
                                  <AvatarFallback className="text-xs">Item</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-muted-foreground">x{item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="text-center mt-4">
                      <Button asChild variant="outline">
                        <Link href="/account/orders">View All Orders</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Button asChild className="bg-purple-700 hover:bg-purple-800">
                      <Link href="/store">Start Shopping</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/account/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/account/orders" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Order History
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/account/addresses" className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Saved Addresses
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/account/payment-methods" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Link>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}

