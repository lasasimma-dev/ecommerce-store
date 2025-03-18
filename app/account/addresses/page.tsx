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
import { Plus, MapPin, Check, Pencil, Trash2, AlertCircle } from "lucide-react"

export default function AddressesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, addresses, addAddress } = useAuth()
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // New address form state
  const [addressName, setAddressName] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("United States")
  const [isDefault, setIsDefault] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    setAddressName("")
    setAddressLine1("")
    setAddressLine2("")
    setCity("")
    setState("")
    setPostalCode("")
    setCountry("United States")
    setIsDefault(false)
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsAddingAddress(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add the new address
      addAddress({
        name: addressName,
        line1: addressLine1,
        line2: addressLine2 || undefined,
        city,
        state,
        postalCode,
        country,
        isDefault,
      })

      setSuccessMessage("Address added successfully")
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      setError("Failed to add address. Please try again.")
    } finally {
      setIsAddingAddress(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    // In a real app, you would delete the address from your backend
    alert(`Delete address ${addressId} - This would be implemented in a real app`)
  }

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800">
                <Plus className="mr-2 h-4 w-4" /> Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <form onSubmit={handleAddAddress}>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new address. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressName">Address Name</Label>
                    <Input
                      id="addressName"
                      placeholder="Home, Work, etc."
                      value={addressName}
                      onChange={(e) => setAddressName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      placeholder="Street address"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input
                      id="addressLine2"
                      placeholder="Apartment, suite, unit, etc."
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isDefault"
                      checked={isDefault}
                      onCheckedChange={(checked) => setIsDefault(checked === true)}
                    />
                    <Label htmlFor="isDefault">Set as default address</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800" disabled={isAddingAddress}>
                    {isAddingAddress ? "Saving..." : "Save Address"}
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

        {addresses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <Card key={address.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {address.isDefault ? (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Default</Badge>
                    ) : null}
                    <CardTitle className="text-lg">{address.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
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
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-6">
              You haven't saved any addresses yet. Add an address to make checkout faster.
            </p>
            <Button className="bg-purple-700 hover:bg-purple-800" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Address
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

