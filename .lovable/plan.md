

# Enhanced Food Ordering App — Implementation Plan

## Summary
Upgrade the existing app with an expanded checkout flow, full admin dashboard with tabbed interface, WhatsApp integration, invoice generation, and analytics overview.

---

## What Changes

### 1. Expand Data Types (`src/lib/types.ts`)
- **Order**: Add `email`, `phone`, `countryCode`, `deliveryType` ("delivery" | "pickup"), `notes`, `timestamp` (ISO string). Expand `status` to: Pending | Confirmed | Preparing | Ready | Completed.
- **BusinessSettings**: Add `whatsappTemplate` (default: "Hello {name}, your order #{id} is {status}. Total: ₱{total}. Thank you!"), `invoiceFooter`, `taxRate`.

### 2. Enhanced Checkout Flow (`src/components/CartSidebar.tsx`)
Replace the simple name/contact checkout with a proper form:
- Full name (required)
- Email (required)
- Phone with country code dropdown (+63 default, common codes)
- Delivery or Pickup (radio buttons)
- Optional notes textarea
- Validation before submit
- Order confirmation toast with order ID
- Generate unique ID: timestamp + 4-char random string

### 3. Update `checkout()` in AppContext
- Accept full checkout data object instead of just name/contact
- Store all new fields on the Order
- Use ISO timestamp for `timestamp` field

### 4. Admin Dashboard with Tabs (`src/components/AdminDashboard.tsx`)
When `adminMode` is true, replace the simple admin bar + inline orders with a full tabbed dashboard. Tabs:

**Tab 1: Orders Management**
- List all orders newest-first with full details (ID, timestamp, customer name/email/phone, delivery type, items, total, status)
- Status filter dropdown + search by customer/order ID
- Per-order action buttons:
  - Status change dropdown (Pending → Confirmed → Preparing → Ready → Completed)
  - **Send WhatsApp** — opens `https://wa.me/{countryCode}{phone}?text={encodedMessage}` using the business template with variables replaced
  - **View Invoice** — opens InvoiceModal

**Tab 2: Products**
- Existing product grid with admin controls (edit, delete, toggle, inventory)
- Add Product button, CSV import/export

**Tab 3: Business Settings**
- Existing business settings fields + new: WhatsApp template editor, invoice footer, tax rate

**Tab 4: Analytics Overview**
- Orders today / this week count
- Total revenue today / this week
- Low stock alerts (≤ 3)
- Top 5 most sold products (calculated from orders)

### 5. Invoice Modal (`src/components/InvoiceModal.tsx`)
- Professional invoice layout rendered as HTML
- Business logo + name + address from settings
- Customer details (name, email, phone, delivery/pickup)
- Order items table with quantities, unit prices, totals
- Subtotal, tax (if configured), grand total
- Order ID + timestamp
- Print button (window.print() with print-specific CSS)

### 6. Update Index Page (`src/pages/Index.tsx`)
- When `adminMode` is true, render `AdminDashboard` instead of the product grid
- Customer view stays the same (search, filter, product grid, cart)

### 7. Files to Create
- `src/components/AdminDashboard.tsx` — tabbed admin interface
- `src/components/InvoiceModal.tsx` — invoice view/print
- `src/components/CheckoutForm.tsx` — expanded checkout form (used inside CartSidebar)

### 8. Files to Modify
- `src/lib/types.ts` — expanded Order and BusinessSettings
- `src/context/AppContext.tsx` — updated checkout function signature, updateOrderStatus function
- `src/components/CartSidebar.tsx` — integrate CheckoutForm
- `src/pages/Index.tsx` — conditional admin dashboard render
- `src/components/BusinessModal.tsx` — add WhatsApp template, invoice settings
- `src/lib/store.ts` — update DEFAULT_BUSINESS with new fields

---

## Technical Details

- WhatsApp link: `https://wa.me/${phone}?text=${encodeURIComponent(message)}` — template variables `{name}`, `{id}`, `{status}`, `{total}` replaced at send time
- Invoice print: use `@media print` CSS to hide non-invoice elements, or open in a new window
- Order ID format: `ORD-{timestamp}-{random4}` e.g. `ORD-1713200000-A3F2`
- Country codes: dropdown with common options (+63 Philippines default, +1 US, +44 UK, etc.)
- All data stays in localStorage — no backend changes needed

