"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "All" },
  { id: "electronics", name: "Electronics" },
  { id: "audio", name: "Audio" },
  { id: "accessories", name: "Accessories" },
  { id: "kitchenware", name: "Kitchenware" },
  { id: "home", name: "Home" },
  { id: "stationery", name: "Stationery" },
]

export default function CategorySidebar() {
  const pathname = usePathname()
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const isActive = (category: string) => {
    if (category === "all" && pathname === "/store") return true
    return pathname === `/store/${category}`
  }

  return (
    <div className="w-64 border-r p-6 flex flex-col h-full sticky top-[69px]">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Categories</h2>
        <div className="space-y-1">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.id === "all" ? "/store" : `/store/${category.id}`}
              className={cn(
                "block px-3 py-2 rounded-md text-sm transition-colors",
                isActive(category.id) ? "bg-purple-100 text-purple-700 font-medium" : "hover:bg-gray-100",
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Price Range</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <Button className="w-full bg-purple-700 hover:bg-purple-800">Apply</Button>
      </div>
    </div>
  )
}

