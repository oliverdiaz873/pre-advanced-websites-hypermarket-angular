import type { APIRequestContext } from '@playwright/test';

/**
 * E3-Integration helpers.
 *
 * Verifican, contra los endpoints admin que renderiza el dashboard
 * (GET /api/admin/orders, GET /api/inventory, GET /api/inventory/:id/movements,
 * GET /api/admin/audit-logs), que las acciones del cliente se reflejan
 * correctamente: orden (usuario, items, totales, estado, pago), reserva y
 * liberación de stock, movimientos y audit logs.
 */

export const API = 'http://localhost:3000/api'
export const ADMIN_EMAIL = 'oliver@email.com'
export const ADMIN_PASSWORD = '123456'

export interface OrderEvidence {  orderId: string
  orderNumber: string
  productId: string
  quantity: number
  customerEmail: string
}

export interface InventoryRecord {
  id: string
  productId: string
  stock: number
  reservedStock: number
  minStock: number
}

export async function adminLogin(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${API}/auth/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  if (!res.ok()) {
    throw new Error(`admin login failed: ${res.status()} ${await res.text()}`)
  }
  const body = await res.json()
  const token = body?.data?.token as string | undefined
  if (!token) {
    throw new Error(`admin login response missing token: ${await res.text()}`)
  }
  return token
}

export async function getAdminOrder(
  request: APIRequestContext,
  token: string,
  orderId: string,
): Promise<any> {
  const res = await request.get(`${API}/admin/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok()) {
    throw new Error(`admin order get ${orderId} failed: ${res.status()} ${await res.text()}`)
  }
  return (await res.json()).data
}

export async function findInventory(
  request: APIRequestContext,
  token: string,
  productId: string,
): Promise<InventoryRecord> {
  const res = await request.get(`${API}/inventory?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok()) {
    throw new Error(`inventory list failed: ${res.status()} ${await res.text()}`)
  }
  const data = (await res.json()).data as InventoryRecord[]
  const record = data.find((i) => i.productId === productId)
  if (!record) {
    throw new Error(`inventory record not found for ${productId}`)
  }
  return record
}

export async function getInventoryMovements(
  request: APIRequestContext,
  token: string,
  inventoryId: string,
): Promise<Array<{ type: string; quantity: number; orderId?: string; reason: string }>> {
  const res = await request.get(`${API}/inventory/${inventoryId}/movements?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok()) {
    throw new Error(`inventory movements failed: ${res.status()} ${await res.text()}`)
  }
  return (await res.json()).data
}

export async function getAuditLogs(
  request: APIRequestContext,
  token: string,
  entityId: string,
): Promise<Array<{ action: string }>> {
  const res = await request.get(`${API}/admin/audit-logs?entityId=${encodeURIComponent(entityId)}&limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok()) {
    throw new Error(`audit logs failed: ${res.status()} ${await res.text()}`)
  }
  return (await res.json()).data
}

export async function assertAdminOrderState(
  request: APIRequestContext,
  token: string,
  ev: OrderEvidence,
  expected: { status: string; paymentStatus: string },
): Promise<any> {
  const order = await getAdminOrder(request, token, ev.orderId)
  if (order.status !== expected.status) {
    throw new Error(`admin order status expected ${expected.status}, got ${order.status}`)
  }
  if (order.paymentStatus !== expected.paymentStatus) {
    throw new Error(
      `admin order paymentStatus expected ${expected.paymentStatus}, got ${order.paymentStatus}`,
    )
  }
  if (order.orderNumber !== ev.orderNumber) {
    throw new Error(`admin order orderNumber mismatch: ${order.orderNumber} vs ${ev.orderNumber}`)
  }
  if (order.customer?.email !== ev.customerEmail) {
    throw new Error(
      `admin order customer expected ${ev.customerEmail}, got ${order.customer?.email}`,
    )
  }
  return order
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  status: string
}

export async function getContacts(
  request: APIRequestContext,
  token: string,
): Promise<ContactMessage[]> {
  const res = await request.get(`${API}/admin/contact`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok()) {
    throw new Error(`admin contact list failed: ${res.status()} ${await res.text()}`)
  }
  const body = (await res.json()) as { data?: ContactMessage[] }
  return body.data ?? []
}
