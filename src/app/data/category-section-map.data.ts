/**
 * Convierte un slug de subcategoría (hash de href) al valor de `producto.categoria`.
 * Desde la corrección de categorías (guiones bajos → guiones), ambos formatos coinciden,
 * por lo que la función es una identidad. Se mantiene por compatibilidad de API pública.
 */
export function sectionSlugToProductCategoria(slug: string): string {
    return slug
}

/** Extrae el fragmento #seccion de un href como "/category/foo#bar" -> "bar" */
export function subcategorySlugFromHref(href: string): string {
    const hash = href.split('#')[1]
    return hash ?? ''
}
