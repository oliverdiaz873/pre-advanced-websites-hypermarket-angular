import { test, expect } from '@playwright/test'
import { adminLogin, getContacts } from './helpers/admin-api'

/**
 * E4.5 — Contact: verificación de integración vertical real.
 *
 * Flujo crítico:
 *   1) El consumidor envía el formulario de contacto por la UI
 *      (POST real /api/contact, sin mocks ni setTimeout).
 *   2) El mensaje persiste en MongoDB.
 *   3) Aparece en el Contact Inbox vía GET /api/admin/contact (el endpoint
 *      que renderiza el dashboard), con estado `pending`.
 *   4) Transición admin `pending → read` vía PATCH, y borrado vía DELETE
 *      (restaurando el estado para que el test sea repetible).
 */

test('E4.5: contact form → POST /api/contact → Mongo → /api/admin/contact → inbox', async ({
  page,
  playwright,
}) => {
  const name = 'Cliente Integracion'
  const email = `e2e.contacto.${Date.now()}@example.com`
  const phone = '8095551212'
  const message = 'Mensaje E2E de verificación de integración de contacto.'

  // 1) Envío real por la UI
  await page.goto('/contact')
  await page.waitForSelector('html[data-hydrated="true"]', { state: 'attached' })
  await page.fill('#nombre', name)
  await page.fill('#email', email)
  await page.fill('#telefono', phone)
  await page.fill('#mensaje', message)
  await page.getByRole('button', { name: 'Enviar' }).click()
  await expect(page.locator('.toast-message')).toContainText('¡Mensaje enviado con éxito!')

  // 2) Persistencia en MongoDB + 3) aparición en el inbox (GET /api/admin/contact)
  const adminCtx = await playwright.request.newContext()
  const token = await adminLogin(adminCtx)
  const found = await test.step('inbox contiene el mensaje', async () => {
    const contacts = await getContacts(adminCtx, token)
    return contacts.find((c) => c.email === email)
  })
  if (!found) throw new Error('contact message not found via /api/admin/contact')
  expect(found.name).toBe(name)
  expect(found.phone).toBe(phone)
  expect(found.message).toBe(message)
  expect(found.status).toBe('pending')

  // 4) Transición admin pending → read
  const patched = await adminCtx.patch(
    `http://localhost:3000/api/admin/contact/${found.id}`,
    { headers: { Authorization: `Bearer ${token}` }, data: { status: 'read' } },
  )
  expect(patched.ok()).toBeTruthy()
  expect((await patched.json()).data.status).toBe('read')

  // Limpieza: borrado admin para que el test sea repetible
  const deleted = await adminCtx.delete(
    `http://localhost:3000/api/admin/contact/${found.id}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  expect(deleted.status()).toBe(204)
})