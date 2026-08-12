import { test, expect } from '@playwright/test'
import { API, adminLogin } from './helpers/admin-api'

/**
 * E3-Admin — acciones administrativas verificadas independientemente del flujo
 * customer, mediante Admin API (los mismos endpoints que renderiza el dashboard):
 *   - Ajuste de inventario (increase → decrease, restaurando el estado).
 *   - Transición de estado de orden con nota (pending → confirmed → cancelled)
 *     con verificación del historial y de los audit logs.
 */

test('E3-Admin: inventory adjust (increase/decrease) + movements', async ({ playwright }) => {
  const adminCtx = await playwright.request.newContext()
  const token = await adminLogin(adminCtx)

  const list = await adminCtx.get(`${API}/inventory?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  expect(list.ok()).toBeTruthy()
  const rec = ((await list.json()).data as Array<{ id: string; productId: string; stock: number }>).find(
    (i) => i.productId === 'tablet_rted',
  )
  if (!rec) throw new Error('inventory record not found for tablet_rted')
  const before = rec.stock

  // Aumentar +5
  const up = await adminCtx.post(`${API}/inventory/${rec.id}/adjust`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { operation: 'increase', quantity: 5, reason: 'inventory_count' },
  })
  expect(up.ok()).toBeTruthy()
  expect((await up.json()).data.stock).toBe(before + 5)

  // Disminuir -5 (restaurar estado)
  const down = await adminCtx.post(`${API}/inventory/${rec.id}/adjust`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { operation: 'decrease', quantity: 5, reason: 'manual_correction' },
  })
  expect(down.ok()).toBeTruthy()
  expect((await down.json()).data.stock).toBe(before)

  // Movimientos registrados (los más recientes primero)
  const movesRes = await adminCtx.get(`${API}/inventory/${rec.id}/movements?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  expect(movesRes.ok()).toBeTruthy()
  const moves = (await movesRes.json()).data as Array<{ type: string; quantity: number }>
  const increase = moves.find((m) => m.type === 'increase' && m.quantity === 5)
  const decrease = moves.find((m) => m.type === 'decrease' && m.quantity === 5)
  if (!increase) throw new Error('increase movement missing')
  if (!decrease) throw new Error('decrease movement missing')
})

test('E3-Admin: order status transition + note persisted + audit', async ({ playwright }) => {
  const adminCtx = await playwright.request.newContext()
  const token = await adminLogin(adminCtx)

  // Crear una orden customer fresca (vía API) para el test de admin, sin depender
  // de datos acumulados.
  const custCtx = await playwright.request.newContext()
  const login = await custCtx.post(`${API}/auth/login`, {
    data: { email: 'maria@email.com', password: '123456' },
  })
  expect(login.ok()).toBeTruthy()
  await custCtx.delete(`${API}/cart`).catch(() => undefined)
  await custCtx.post(`${API}/cart/items`, { data: { productId: 'tablet_tcl', quantity: 1 } })
  const addr = await custCtx.post(`${API}/addresses`, {
    data: {
      label: `E2E-Admin-${Date.now()}`,
      street: 'Calle Admin 1',
      city: 'Santo Domingo',
      state: 'Distrito Nacional',
      zipCode: '10101',
      country: 'DO',
    },
  })
  expect(addr.ok()).toBeTruthy()
  const addressId = (await addr.json()).data.id
  const orderRes = await custCtx.post(`${API}/orders`, {
    data: { addressId, idempotencyKey: `e2e-admin-${Date.now()}` },
  })
  expect(orderRes.status()).toBe(201)
  const orderId = (await orderRes.json()).data.id

  try {
    // Transición admin: pending → confirmed con nota
    const note = 'E2E Admin confirm note'
    const upd = await adminCtx.patch(`${API}/admin/orders/${orderId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { status: 'confirmed', note },
    })
    expect(upd.ok()).toBeTruthy()
    const confirmed = (await upd.json()).data
    expect(confirmed.status).toBe('confirmed')
    const last = confirmed.statusHistory[confirmed.statusHistory.length - 1]
    if (!last) throw new Error('statusHistory empty')
    expect(last.status).toBe('confirmed')
    expect(last.note).toBe(note)

    // Transición admin: confirmed → cancelled
    const cancel = await adminCtx.patch(`${API}/admin/orders/${orderId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { status: 'cancelled', note: 'E2E Admin cancel' },
    })
    expect(cancel.ok()).toBeTruthy()
    expect((await cancel.json()).data.status).toBe('cancelled')

    // Audit logs: ambas transiciones registradas. El backend escribe los logs
    // de forma asíncrona (fire-and-forget), así que se espera la aparición de
    // CANCEL_ORDER en lugar de consultar una única vez (evita un race).
    const auditActions = (): Promise<string[]> =>
      adminCtx
        .get(`${API}/admin/audit-logs?entityId=${orderId}&limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) =>
          res.ok()
            ? ((await res.json()).data as Array<{ action: string }>).map((l) => l.action)
            : [],
        )
    await expect
      .poll(auditActions, { timeout: 10_000 })
      .toEqual(expect.arrayContaining(['UPDATE_ORDER_STATUS', 'CANCEL_ORDER']))
  } finally {
    await custCtx.delete(`${API}/addresses/${addressId}`).catch(() => undefined)
  }
})
