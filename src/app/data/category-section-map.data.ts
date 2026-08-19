/**
 * Convierte un slug de subcategoría (hash de href) al valor de `producto.categoria`.
 * Desde la corrección de categorías (guiones bajos → guiones), ambos formatos coinciden,
 * por lo que la función es una identidad. Se mantiene por compatibilidad de API pública.
 */
export function sectionSlugToProductCategoria(slug: string): string {
    return slug
}

/**
 * Extrae el slug de subcategoría de un href de navegación, sea de ruta
 * ("/category/foo/bar" -> "bar") o de fragmento hash ("/category/foo#bar" -> "bar").
 */
export function subcategorySlugFromHref(href: string): string {
    return href.split(/[/#]/).filter(Boolean).pop() ?? ''
}
