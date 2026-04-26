# Implementation Roadmap: Theme System

## Phase 1: Core Theme System
- [x] Define CSS color variables for all 4 themes in `globals.css` using `[data-theme]` attributes.
- [x] Create a `ThemeProvider` component to manage state and `localStorage`.
- [x] Add smooth CSS transitions to `body` and interactive elements.

## Phase 2: Navigation & Theme Toggle
- [x] Update `Navbar` component with the requested links.
- [x] Implement `ThemeToggle` component with icons and labels for each theme.
- [x] Add glassmorphism styling to the Navbar.

## Phase 3: Home Page Layout
- [x] Build the `Hero` section with the specified heading and subtext.
- [x] Build the `SidebarFilters` component (Search, Sort, Categories).
- [x] Build the `ProductGrid` and `ProductCard` components.
- [x] Add "Best Seller" badge logic to the grid.

## Phase 4: Polish & Responsive Design
- [x] Ensure all components respond correctly to theme changes.
- [x] Implement mobile-responsive layout for the Sidebar and Grid.
- [x] Add micro-animations (hover effects, card scaling).

## Phase 5: Sell Product Flow [NEW]
- [ ] **Component:** Create `SellModal.tsx` and `SellModal.module.css`.
  - [ ] Build the overlay backdrop and modal container matching the surface glass theme.
  - [ ] Implement text, number, select, and textarea form inputs.
  - [ ] Build drag-and-drop image upload zone with an image preview capability using `URL.createObjectURL()`.
  - [ ] Setup form state management and basic validation.
- [ ] **Integration:** Update Navbars
  - [ ] Add the "Sell" button (primary style, `Tag` icon) to the desktop `Navbar.tsx`.
  - [ ] Add the "Sell" button to the `MobileMenu.tsx` component.
  - [ ] Manage the `isSellModalOpen` state.
- [ ] **UX Polish & Submission:**
  - [ ] Hook up the existing `Toast` component (or add one if needed) to fire a success notification upon form submission.
  - [ ] Ensure focus state, escape key handling, and click-outside-to-close behavior are working for the modal.
