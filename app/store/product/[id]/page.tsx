import { products } from "@/lib/products"
import StoreLayout from "@/components/store-layout"
import ProductDetail from "@/components/product-detail"
import { notFound } from "next/navigation"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <StoreLayout>
      <ProductDetail product={product} />
    </StoreLayout>
  )
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

