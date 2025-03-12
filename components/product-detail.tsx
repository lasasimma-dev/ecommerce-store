"use client"

import Image from "next/image"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Heart } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="aspect-square relative rounded-lg overflow-hidden border">
        <Image
          src={product.image || "/placeholder.svg?height=600&width=600"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.category}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-gray-500")} />
          </Button>
        </div>

        <div className="mt-6">
          <p className="text-3xl font-bold text-purple-700">${product.price.toFixed(2)}</p>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-muted-foreground">{product.description || "No description available for this product."}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button size="lg" className="w-full bg-purple-700 hover:bg-purple-800" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              Buy Now
            </Button>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-medium mb-2">Product Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex">
                <span className="text-muted-foreground w-24">Category:</span>
                <span>{product.category}</span>
              </li>
              <li className="flex">
                <span className="text-muted-foreground w-24">SKU:</span>
                <span>{product.id}</span>
              </li>
              <li className="flex">
                <span className="text-muted-foreground w-24">Availability:</span>
                <span>In Stock</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

