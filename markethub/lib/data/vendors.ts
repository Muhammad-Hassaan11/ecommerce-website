import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Vendor } from '@/types'
import { getAllProducts } from './products'
import type { Product } from '@/types'

const VENDORS_DIR = path.join(process.cwd(), 'data', 'vendors')

// In-memory cache
let cachedVendors: Vendor[] | null = null

function parseVendor(filePath: string): Vendor | null {
  const filename = path.basename(filePath, '.md')
  let raw: string

  try {
    raw = fs.readFileSync(filePath, 'utf-8')
  } catch {
    console.warn(`[vendors] Could not read file: ${filePath}`)
    return null
  }

  const parsed = matter(raw)
  const { data } = parsed

  if (!data.slug || typeof data.slug !== 'string') {
    console.warn(`[vendors] Missing or invalid "slug" in ${filePath}`)
    return null
  }
  if (data.slug !== filename) {
    console.warn(`[vendors] slug "${data.slug}" does not match filename "${filename}" — skipping`)
    return null
  }
  if (!data.name || typeof data.name !== 'string') {
    console.warn(`[vendors] Missing or invalid "name" in ${filePath}`)
    return null
  }
  if (!data.bannerImage || typeof data.bannerImage !== 'string') {
    console.warn(`[vendors] Missing or invalid "bannerImage" in ${filePath}`)
    return null
  }
  if (!data.logoImage || typeof data.logoImage !== 'string') {
    console.warn(`[vendors] Missing or invalid "logoImage" in ${filePath}`)
    return null
  }
  if (!data.location || typeof data.location !== 'string') {
    console.warn(`[vendors] Missing or invalid "location" in ${filePath}`)
    return null
  }
  if (!data.joinedAt || isNaN(Date.parse(String(data.joinedAt)))) {
    console.warn(`[vendors] Missing or invalid "joinedAt" in ${filePath}`)
    return null
  }

  let rating = 0
  if (typeof data.rating !== 'number') {
    console.warn(`[vendors] Invalid "rating" in ${filePath} — defaulting to 0`)
  } else {
    rating = Math.min(5, Math.max(0, data.rating))
  }

  return {
    slug: data.slug,
    name: data.name,
    description: typeof parsed.content === 'string' ? parsed.content.trim() : '',
    bannerImage: data.bannerImage,
    logoImage: data.logoImage,
    location: data.location,
    joinedAt: String(data.joinedAt),
    rating,
  }
}

export function getAllVendors(): Vendor[] {
  if (cachedVendors) return cachedVendors

  if (!fs.existsSync(VENDORS_DIR)) return []

  const files = fs.readdirSync(VENDORS_DIR).filter((f) => f.endsWith('.md'))
  const vendors: Vendor[] = []

  for (const file of files) {
    const vendor = parseVendor(path.join(VENDORS_DIR, file))
    if (vendor) vendors.push(vendor)
  }

  cachedVendors = vendors
  return vendors
}

export function getVendorBySlug(slug: string): Vendor | null {
  // Try cache first
  if (cachedVendors) {
    return cachedVendors.find((v) => v.slug === slug) || null
  }

  const filePath = path.join(VENDORS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return parseVendor(filePath)
}

export function getProductsByVendorSlug(vendorSlug: string): Product[] {
  return getAllProducts().filter((p) => p.vendorSlug === vendorSlug)
}
