"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import StoreLayout from "@/components/store-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Plus, Check, Pencil, Trash2, AlertCircle } from "lucide-react"

export default function PaymentMethodsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, paymentMethods, addPaymentMethod } = useAuth()
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // New payment method form state
  const [paymentType, setPaymentType] = useState<"card" | "paypal">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [isDefault, setIsDefault] = useState(false)

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

  const resetForm = () => {
    setPaymentType("card")
    setCardNumber("")
    setCardName("")
    setExpiryDate("")
    setCvv("")
    setPaypalEmail("")
    setIsDefault(false)
  }

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsAddingPayment(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (paymentType === "card") {
        // Format card details
        const last4 = cardNumber.slice(-4)

        // Add the new payment method
        addPaymentMethod({
          type: "card",
          name: `${cardName}'s card ending in ${last4}`,
          last4,
          expiryDate,
          isDefault,
        })
      } else {
        // Add PayPal payment method
        addPaymentMethod({
          type: "paypal",
          name: `PayPal - ${paypalEmail}`,
          isDefault,
        })
      }

      setSuccessMessage("Payment method added successfully")
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      setError("Failed to add payment method. Please try again.")
    } finally {
      setIsAddingPayment(false)
    }
  }

  const handleDeletePaymentMethod = async (paymentId: string) => {
    // In a real app, you would delete the payment method from your backend
    alert(`Delete payment method ${paymentId} - This would be implemented in a real app`)
  }

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800">
                <Plus className="mr-2 h-4 w-4" /> Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <form onSubmit={handleAddPaymentMethod}>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Enter your payment details. Your information is securely stored.
                  </DialogDescription>
                </DialogHeader>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="py-4">
                  <Tabs defaultValue="card" onValueChange={(value) => setPaymentType(value as "card" | "paypal")}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="card">Credit Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4">
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
                    </TabsContent>

                    <TabsContent value="paypal" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="paypalEmail">PayPal Email</Label>
                        <Input
                          id="paypalEmail"
                          type="email"
                          placeholder="your-email@example.com"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                        <p>You'll be redirected to PayPal to link your account when you make a purchase.</p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="isDefault"
                      checked={isDefault}
                      onCheckedChange={(checked) => setIsDefault(checked === true)}
                    />
                    <Label htmlFor="isDefault">Set as default payment method</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={isAddingPayment}>
                    {isAddingPayment ? "Saving..." : "Save Payment Method"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {successMessage && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {paymentMethods.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {method.isDefault ? (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Default</Badge>
                    ) : null}
                    <CardTitle className="text-lg flex items-center">
                      {method.type === "card" ? (
                        <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                      ) : (
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none">
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
                      {method.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    {method.type === "card" && <p className="text-muted-foreground">Expires: {method.expiryDate}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
            <p className="text-muted-foreground mb-6">
              You haven't saved any payment methods yet. Add a payment method to make checkout faster.
            </p>
            <Button className="bg-purple-700 hover:bg-purple-800" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

