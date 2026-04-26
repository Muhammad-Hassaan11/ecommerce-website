import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Product } from '@/types'

const PRODUCTS_DIR = path.join(process.cwd(), 'data', 'products')

// In-memory cache to avoid re-reading all files on every request during dev
let cachedProducts: Product[] | null = null

function parseProduct(filePath: string): Product | null {
  const filename = path.basename(filePath, '.md')
  let raw: string

  try {
    raw = fs.readFileSync(filePath, 'utf-8')
  } catch {
    console.warn(`[products] Could not read file: ${filePath}`)
    return null
  }

  const parsed = matter(raw)
  const { data } = parsed

  // Validate required fields
  if (!data.slug || typeof data.slug !== 'string') {
    console.warn(`[products] Missing or invalid "slug" in ${filePath}`)
    return null
  }
  if (data.slug !== filename) {
    console.warn(`[products] slug "${data.slug}" does not match filename "${filename}" — skipping`)
    return null
  }
  if (!data.name || typeof data.name !== 'string') {
    console.warn(`[products] Missing or invalid "name" in ${filePath}`)
    return null
  }
  if (typeof data.price !== 'number' || data.price <= 0) {
    console.warn(`[products] Missing or invalid "price" in ${filePath}`)
    return null
  }
  if (!data.category || typeof data.category !== 'string') {
    console.warn(`[products] Missing or invalid "category" in ${filePath}`)
    return null
  }
  if (!Array.isArray(data.images) || data.images.length === 0) {
    console.warn(`[products] Missing or invalid "images" in ${filePath}`)
    return null
  }

  // Soft-validate vendorSlug
  if (!data.vendorSlug || typeof data.vendorSlug !== 'string') {
    console.warn(`[products] Missing "vendorSlug" in ${filePath} — will render "Unknown Vendor"`)
  }

  // Soft-validate inStock
  let inStock: boolean = false
  if (typeof data.inStock !== 'boolean') {
    console.warn(`[products] Invalid "inStock" in ${filePath} — defaulting to false`)
  } else {
    inStock = data.inStock
  }

  // Soft-validate createdAt
  let createdAt: string = new Date().toISOString().split('T')[0]
  if (!data.createdAt || isNaN(Date.parse(String(data.createdAt)))) {
    console.warn(`[products] Invalid "createdAt" in ${filePath} — defaulting to today`)
  } else {
    createdAt = String(data.createdAt)
  }

  // Parse isBestSeller
  let isBestSeller: boolean = false
  if (typeof data.isBestSeller === 'boolean') {
    isBestSeller = data.isBestSeller
  }

  return {
    slug: data.slug,
    name: data.name,
    price: data.price,
    category: data.category,
    images: data.images as string[],
    vendorSlug: typeof data.vendorSlug === 'string' ? data.vendorSlug : '',
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    inStock,
    createdAt,
    isBestSeller,
    description: typeof parsed.content === 'string' ? parsed.content.trim() : '',
  }
}

export function getAllProducts(): Product[] {
  if (cachedProducts) return cachedProducts

  if (!fs.existsSync(PRODUCTS_DIR)) return []

  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith('.md'))
  const products: Product[] = []

  for (const file of files) {
    const product = parseProduct(path.join(PRODUCTS_DIR, file))
    if (product) products.push(product)
  }

  cachedProducts = products
  return products
}

export function getProductBySlug(slug: string): Product | null {
  // Try cache first
  if (cachedProducts) {
    return cachedProducts.find((p) => p.slug === slug) || null
  }

  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return parseProduct(filePath)
}

export function getAllCategories(): string[] {
  const products = getAllProducts()
  const set = new Set(products.map((p) => p.category))
  return Array.from(set).sort()
}

export function getBestSellingProducts(): Product[] {
  const all = getAllProducts();
  return all.filter(p => p.isBestSeller);
}
