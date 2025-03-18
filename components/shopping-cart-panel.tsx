"use client"

import { X, ShoppingBag, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ShoppingCartPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingCartPanel({ isOpen, onClose }: ShoppingCartPanelProps) {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getTotalPrice, getTotalItems } =
    useCart()

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-96 bg-white border-l shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={() => removeFromCart(item.id)}
                  onIncrease={() => increaseQuantity(item.id)}
                  onDecrease={() => decreaseQuantity(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/checkout" onClick={onClose}>
                <Button className="w-full bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800">Checkout</Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
      <p className="text-muted-foreground mb-6">Add products to your cart to begin checkout</p>
      <Link href="/store">
        <Button className="bg-gradient-to-r from-red-600 to-purple-700 hover:bg-purple-800">Continue Shopping</Button>
      </Link>
    </div>
  )
}

function CartItem({
  item,
  onRemove,
  onIncrease,
  onDecrease,
}: {
  item: any
  onRemove: () => void
  onIncrease: () => void
  onDecrease: () => void
}) {
  return (
    <div className="flex gap-4">
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
            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onDecrease}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={onIncrease}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

