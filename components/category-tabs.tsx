"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const categories = [
  { id: "all", name: "All Products" },
  { id: "electronics", name: "Electronics" },
  { id: "audio", name: "Audio" },
  { id: "accessories", name: "Accessories" },
  { id: "kitchenware", name: "Kitchenware" },
  { id: "home", name: "Home" },
  { id: "stationery", name: "Stationery" },
]

export default function CategoryTabs() {
  const pathname = usePathname()

  const isActive = (category: string) => {
    if (category === "all" && pathname === "/store") return true
    return pathname === `/store/${category}`
  }

  return (
    <div className="relative">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 py-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.id === "all" ? "/store" : `/store/${category.id}`}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                "border border-gray-200 hover:border-gray-300",
                isActive(category.id)
                  ? "bg-purple-700 text-white hover:bg-purple-800"
                  : "bg-white text-gray-700 hover:bg-gray-100",
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

