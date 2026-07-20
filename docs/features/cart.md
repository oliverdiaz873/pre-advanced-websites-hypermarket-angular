# Cart

## Status

Implemented.

## Overview

The cart is a client-side feature implemented with Angular Signals and persisted to browser `localStorage`. `CartService` is a singleton provided at root, so cart state is available to the header badge, product actions, and cart page.

## State Management

```
User action
    |
    v
CartService
    |
    +--> WritableSignal(cartItems)
    |
    +--> computed(totalItems)
    |
    +--> computed(totalPrice)
    |
    v
effect()
    |
    v
localStorage
```

## CartService

Location: `src/app/features/cart/services/cart.service.ts`

Provides:

- `WritableSignal<CartItem[]>` for cart items.
- `computed` signals: `totalItems`, `totalPrice`.
- `effect()` for automatic localStorage persistence under key `carrito`.
- Hydration from localStorage on service initialization.

### Actions

- `addToCart(product)`: Adds with quantity `1`, or increments if already present.
- `removeFromCart(id)`: Removes item by id.
- `updateQuantity(id, delta)`: Adjusts quantity; removes item if result is `0` or less.
- `clearCart()`: Empties the cart.

## State Model

`CartItem` is defined in `src/app/features/cart/types/`.

Fields: `id`, `nombre`, `precio`, `precioTexto`, `img`, `unidad`, `cantidad`, `isOffer`, `oldPrice`, `discountPercentage`.

Derived values: `totalItems` (sum of quantities), `totalPrice` (sum of `precio * cantidad`).

## Components

- `CartPageComponent`: Full cart page with items list and summary.
- `CartItemsListComponent`: Iterates cart items with `trackBy`.
- `CartItemComponent`: Single item row with quantity controls.
- `CartSummaryComponent`: Shows totals and payment button (presentational).
- `EmptyCartComponent`: Empty state with CTA.
- `QuantityControlsComponent`: Increment/decrement buttons.
- `AddToCartButtonComponent`: Product page/card integration with in-cart state toggle.
- `CartHeaderComponent`: Cart header with total items count.
- `CartLayoutComponent`: Container component.

## User Flow

1. Product listings and detail pages render `AddToCartButton`.
2. When the product is not in the cart, the button adds it.
3. When already in cart, the button shows increment/decrement controls.
4. The cart page reads state directly from `CartService`.
5. Empty carts render `EmptyCartComponent`.
6. Non-empty carts render `CartItemsListComponent` and `CartSummaryComponent`.

## Related Files

- `src/app/features/cart/services/cart.service.ts`
- `src/app/features/cart/types/`
- `src/app/features/cart/components/add-to-cart-button/`
- `src/app/features/cart/components/cart-page/`
- `src/app/features/cart/components/cart-items-list/`
- `src/app/features/cart/components/cart-item/`
- `src/app/features/cart/components/quantity-controls/`
- `src/app/features/cart/components/cart-summary/`
- `src/app/features/cart/components/empty-cart/`
- `src/app/features/cart/components/cart-header/`
- `src/app/features/cart/components/cart-layout/`
- `src/app/app.routes.ts` (cart route definition)

## Current Limitations

- Checkout is not implemented.
- The payment button in `CartSummary` is presentational.
- Cart persistence is local to the browser.
- Cart state is not synchronized with a user account or backend.
