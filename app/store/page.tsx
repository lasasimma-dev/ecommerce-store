import StoreLayout from "@/components/store-layout"
import ProductGrid from "@/components/product-grid"
import { products } from "@/lib/products"

export default function StorePage() {
  return (
    <StoreLayout>
      <ProductGrid products={products} />
    </StoreLayout>
  )
}

