/**
 * Data de Ofertas Especiales
 *
 * Este archivo contiene la información de los productos en oferta del hipermercado.
 * Cada oferta vincula un producto (por su id) con su precio anterior.
 * El porcentaje de descuento se deriva a partir del precio actual del producto.
 *
 * Flujo de uso:
 * 1. offersData se importa en useOfferFilters hook
 * 2. Se mapea cada oferta con su producto correspondiente (de productos.ts)
 * 3. Se enriquecen los productos con oldPrice y discountPercentage calculado
 * 4. Los productos enriquecidos se pasan a ProductCard → OfferBadge
 * 5. OfferBadge renderiza el badge con "-X%" (ej: "-20%")
 *
 * @example
 * // En la página de ofertas
 * const { offerProducts } = useOfferFilters()
 * // offerProducts tendrá: { ...producto, oldPrice: "RD$ 56.25", discountPercentage: 20 }
 */

export interface OfferData {
    id: string
    oldPrice: string
}

export const offersData: OfferData[] = [
    { id: 'manzanas_verdes', oldPrice: 'RD$ 56.25' },
    { id: 'huevos_don_pancho', oldPrice: 'RD$ 222.22' },
    { id: 'freezer_7_pies', oldPrice: 'RD$ 19,411' },
    { id: 'celular_samsung_a26', oldPrice: 'RD$ 44,444' },
    { id: 'cilindro_de_gas_duragas', oldPrice: 'RD$ 6,117' },
    { id: 'coca_cola_zero', oldPrice: 'RD$ 84.21' },
    { id: 'limones_persa', oldPrice: 'RD$ 250.00' },
]

const parseOfferPrice = (price: string): number => {
    const normalizedPrice = price.replace(/[^\d.]/g, '')
    return Number.parseFloat(normalizedPrice)
}

export const calculateDiscountPercentage = (currentPrice: number, oldPrice: string): number => {
    const previousPrice = parseOfferPrice(oldPrice)

    if (!Number.isFinite(previousPrice) || previousPrice <= currentPrice) {
        return 0
    }

    return Math.round(((previousPrice - currentPrice) / previousPrice) * 100)
}
