import { Product } from '@core/types/product.interface'

export const cleanPrice = (text: string): string => {
    const cleaned = text.replace(/^[a-z]+:\s*/i, '').trim()
    const match = cleaned.match(/(\$?\d+(?:,\d+)?(?:\.\d+)?)/)
    return match ? match[1] : cleaned
}

export const formatPrice = (value: number): string =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value)

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
