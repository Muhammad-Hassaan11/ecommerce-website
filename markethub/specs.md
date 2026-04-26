# Project Specification: Theme System & Home Page Components

## 1. Project Overview
Implementation of a robust, multi-theme system for MarketHub with 4 distinct visual styles. This includes a theme-aware Navbar, Hero section, Sidebar Filters, and a Product Grid.

**New Feature (Phase 5):** "Sell Product" Modal Flow
Users can quickly list items from the navigation bar using an interactive modal featuring drag-and-drop image uploads, simple form validation, and toast notifications.

## 2. Theme Definitions

### 2.1 Dark (Default)
- **Background**: `#0f0f11`
- **Accent**: `#7c6af7` (Purple)
- **Secondary**: `#3d3d4d`
- **Text**: `#f1f1f4`

### 2.2 Light
- **Background**: `#ffffff`
- **Accent**: `#6C63FF` (Purple)
- **Secondary**: `#f0f0f5`
- **Text**: `#1a1a1a`

### 2.3 Ocean Blue
- **Background**: `#0d1b2a` (Deep Navy)
- **Accent**: `#00cfff` (Cyan)
- **Secondary**: `#1b263b`
- **Text**: `#e0e1dd`

### 2.4 Sunset
- **Background**: `#1a0a00` (Warm Dark)
- **Accent**: `#ff6b35` (Orange)
- **Secondary**: `#2d1b0d`
- **Text**: `#ffeee0`

## 3. UI Components

### 3.1 Global Navigation (Navbar)
- **Logo**: MarketHub Branding
- **Links**: Browse, Best Sellers, Wishlist, Support
- **Sell Button [New]**: Primary solid accent button with a `Tag` icon, positioned between Support and the search actions.
  - Also added to the Mobile Menu (`MobileMenu.tsx`) for smaller screens.
- **Theme Toggle**: Located top-right, includes an icon and label.
- **Visuals**: Glassmorphism effect, sticky position.

### 3.2 Hero Section
- **Heading**: "Discover Products You'll Love"
- **Subtext**: "Curated collections from the world's best independent creators."

### 3.3 Sidebar Filters
- **Inputs**: Search bar, Sort By dropdown, Category dropdowns.

### 3.4 Product Grid
- **Items**: 4 product cards.
- **Card Elements**: Image, Title, Price, Heart icon, "Best Seller" badge (on one).

### 3.5 Sell Product Modal [New Component]
- **Trigger**: "Sell" button in Nav/Mobile Menu.
- **Form Fields**:
  - Product Name (Text Input)
  - Price (Number Input)
  - Category (Dropdown: Electronics, Fashion, Home & Living, Art, Digital Goods)
  - Description (Textarea)
  - Image Upload (Drag-and-drop zone with image preview functionality)
- **Actions**: "Cancel" (Ghost button) and "Submit Listing" (Primary button).
- **Post-Submit**: Closes modal and triggers a success Toast Notification (e.g., "Listing Created Successfully!").
- **Theme Support**: Backgrounds, inputs, and text colors properly utilize global theme variables so it looks native across all 4 themes.

## 4. Technical Requirements
- Save selected theme to `localStorage`.
- Smooth 0.3s CSS transition for all color changes.
- Responsive design (Search/Filters vs Grid, Mobile Nav).
- Modal requires focus trapping and click-outside-to-close behavior.
