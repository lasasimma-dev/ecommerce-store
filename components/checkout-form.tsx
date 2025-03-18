"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

export default function CheckoutForm() {
  const router = useRouter()
  const { cartItems, getTotalPrice } = useCart()
  const { isAuthenticated, isLoading, user, addresses } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)

  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [notes, setNotes] = useState("")

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1 // 10% tax
  const shipping = 5.99
  const total = subtotal + tax + shipping

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email)

      const nameParts = user.name.split(" ")
      if (nameParts.length > 0) {
        setFirstName(nameParts[0])
        if (nameParts.length > 1) {
          setLastName(nameParts.slice(1).join(" "))
        }
      }

      // Set default address if available
      if (addresses.length > 0) {
        const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0]
        setSelectedAddress(defaultAddress.id)
      } else {
        setUseNewAddress(true)
      }
    }
  }, [isAuthenticated, user, addresses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Proceed to payment
    router.push("/checkout/payment")
    setIsSubmitting(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some products to your cart before checking out</p>
        <Button onClick={() => router.push("/store")} className="bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800">
          Back to Store
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isAuthenticated && addresses.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Saved Addresses</h3>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setUseNewAddress(!useNewAddress)}>
                        {useNewAddress ? "Use Saved Address" : "Use New Address"}
                      </Button>
                    </div>

                    {!useNewAddress && (
                      <RadioGroup
                        value={selectedAddress || ""}
                        onValueChange={setSelectedAddress}
                        className="space-y-3"
                      >
                        {addresses.map((addr) => (
                          <div key={addr.id} className="flex items-center space-x-2 border rounded-md p-3">
                            <RadioGroupItem value={addr.id} id={addr.id} />
                            <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                              <div>
                                <p className="font-medium">{addr.name}</p>
                                <p className="text-sm text-muted-foreground">{addr.line1}</p>
                                {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                                <p className="text-sm text-muted-foreground">
                                  {addr.city}, {addr.state} {addr.postalCode}
                                </p>
                                {addr.isDefault && (
                                  <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 mt-1 inline-block">
                                    Default
                                  </span>
                                )}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                )}

                {(useNewAddress || !isAuthenticated || addresses.length === 0) && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {isAuthenticated && (
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="saveAddress" />
                        <Label htmlFor="saveAddress">Save this address for future orders</Label>
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-sm">
                      {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                    </span>
                    <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/store">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

