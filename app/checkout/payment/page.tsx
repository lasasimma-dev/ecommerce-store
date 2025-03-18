"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import StoreLayout from "@/components/store-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, CheckCircle2 } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, paymentMethods } = useAuth()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1 // 10% tax
  const shipping = 5.99
  const total = subtotal + tax + shipping

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout/payment")
    }
  }, [isLoading, isAuthenticated, router])

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      router.push("/store")
    }
  }, [cartItems, router, isSuccess])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSuccess(true)
    clearCart()
    setIsProcessing(false)
  }

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        </div>
      </StoreLayout>
    )
  }

  if (isSuccess) {
    return (
      <StoreLayout>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order has been confirmed.</p>
          <p className="text-sm text-muted-foreground mb-6">
            A confirmation email has been sent to your email address.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800">
              <Link href="/account/orders">View Order</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </StoreLayout>
    )
  }

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Payment</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="saved">Saved Methods</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card">
                    <form onSubmit={handlePayment} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                          />
                          <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full mt-6 bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="paypal">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M7.02 5.5H16.5C17.88 5.5 19 6.62 19 8C19 9.38 17.88 10.5 16.5 10.5H7.02C5.64 10.5 4.52 9.38 4.52 8C4.52 6.62 5.64 5.5 7.02 5.5Z"
                            fill="#00457C"
                          />
                          <path
                            d="M8.52 13.5H18C19.38 13.5 20.5 14.62 20.5 16C20.5 17.38 19.38 18.5 18 18.5H8.52C7.14 18.5 6.02 17.38 6.02 16C6.02 14.62 7.14 13.5 8.52 13.5Z"
                            fill="#0079C1"
                          />
                        </svg>
                      </div>
                      <p className="mb-4">Click the button below to pay with PayPal</p>
                      <Button
                        className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Pay with PayPal"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="saved">
                    {paymentMethods.length > 0 ? (
                      <div className="space-y-4 mt-4">
                        <RadioGroup value={selectedPaymentMethod || ""} onValueChange={setSelectedPaymentMethod}>
                          {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center space-x-2 border rounded-md p-3">
                              <RadioGroupItem value={method.id} id={method.id} />
                              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{method.name}</p>
                                    {method.isDefault && <span className="text-xs text-muted-foreground">Default</span>}
                                  </div>
                                  {method.type === "card" ? (
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                      <path
                                        d="M7.02 5.5H16.5C17.88 5.5 19 6.62 19 8C19 9.38 17.88 10.5 16.5 10.5H7.02C5.64 10.5 4.52 9.38 4.52 8C4.52 6.62 5.64 5.5 7.02 5.5Z"
                                        fill="#00457C"
                                      />
                                      <path
                                        d="M8.52 13.5H18C19.38 13.5 20.5 14.62 20.5 16C20.5 17.38 19.38 18.5 18 18.5H8.52C7.14 18.5 6.02 17.38 6.02 16C6.02 14.62 7.14 13.5 8.52 13.5Z"
                                        fill="#0079C1"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        <Button
                          className="w-full mt-4 bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800"
                          onClick={handlePayment}
                          disabled={isProcessing || !selectedPaymentMethod}
                        >
                          {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="mb-4">You don't have any saved payment methods.</p>
                        <Button
                          variant="outline"
                          onClick={() => (document.querySelector('[data-value="card"]') as HTMLElement)?.click()}
                        >
                          Add a new payment method
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
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
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg?height=40&width=40"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm">
                          {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                        </span>
                      </div>
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
                  <Link href="/checkout">Back to Shipping</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}

