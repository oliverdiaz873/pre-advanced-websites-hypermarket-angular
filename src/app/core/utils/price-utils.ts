/**
 * @fileoverview Utilidades para procesamiento y formateo de precios.
 *
 * Centraliza la lógica de limpieza de precios, extracción de unidades
 * y construcción de etiquetas de precio para evitar duplicación.
 */

import { Product } from '@core/types/product.interface'

/**
 * Extrae el valor del precio desde un texto formateado.
 *
 * @example
 * cleanPrice("Precio: $2,500.00") // "$2,500.00"
 */
export const cleanPrice = (text: string): string => {
    const cleaned = text.replace(/^[a-z]+:\s*/i, '').trim()
    const match = cleaned.match(/(\$?\d+(?:,\d+)?(?:\.\d+)?)/)
    return match ? match[1] : cleaned
}

/**
 * Obtiene la unidad de medida de un producto.
 *
 * Prioridad:
 * 1. Campo explícito `unidad`.
 * 2. Unidad definida en `precioTexto`.
 * 3. Texto descriptivo restante.
 * 4. Fallback: "unidad".
 */
export const unitLabel = (product: Product): string => {
    const explicit = product.unidad?.trim()
    if (explicit) return explicit

    const raw = product.precioTexto?.trim()
    if (raw) {
        const parts = raw.split('/')
        if (parts.length > 1) {
            const last = parts[parts.length - 1].trim().replace(/\.$/, '')
            if (last) return last
        }

        const afterPrecio = raw.replace(/^Precio:\s*/i, '').replace(/^\$[\d.,]+\s*/i, '').trim()
        if (afterPrecio) return afterPrecio
    }

    return 'unidad'
}

interface FormatPriceOptions {
    pricePrefix?: string
    translatedUnit?: string
}

/**
 * Construye el texto del precio para mostrar en la interfaz.
 */
export const formatProductPrice = (
    product: Product,
    { pricePrefix = 'Precio: ', translatedUnit }: FormatPriceOptions = {}
): string => {
    const price = `$${product.precio.toLocaleString()}`
    const hasExplicitUnit = Boolean(product.unidad?.trim())
    const hasInlineUnit = product.precioTexto?.includes('/') ?? false

    if (!hasExplicitUnit && !hasInlineUnit) {
        return `${pricePrefix}${price}`
    }

    const unit = translatedUnit ?? unitLabel(product)
    return `${pricePrefix}${price} / ${unit}`
}
