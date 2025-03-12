import StoreLayout from "@/components/store-layout"
import ProductGrid from "@/components/product-grid"
import { products } from "@/lib/products"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category

  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category.toLowerCase() === category.toLowerCase())

  return (
    <StoreLayout>
      <ProductGrid products={filteredProducts} />
    </StoreLayout>
  )
}

export function generateStaticParams() {
  const categories = ["all", "electronics", "audio", "accessories", "kitchenware", "home", "stationery"]

  return categories.map((category) => ({
    category,
  }))
}

