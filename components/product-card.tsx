"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="group relative bg-white rounded-lg border overflow-hidden transition-all hover:shadow-md">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.preventDefault()
            setIsFavorite(!isFavorite)
          }}
        >
          <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-gray-500")} />
        </Button>
      </div>

      <Link href={`/store/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.category}</p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-purple-700 font-bold">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <Button className="w-full bg-purple-700 hover:bg-purple-800" onClick={() => addToCart(product)}>
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

