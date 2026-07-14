/**
 * @fileoverview Utilidades para búsqueda y normalización de texto.
 *
 * Centraliza funciones auxiliares para procesar consultas de búsqueda,
 * permitiendo comparaciones sin distinguir mayúsculas ni acentos.
 */

/**
 * Normaliza un texto para realizar búsquedas consistentes.
 *
 * Convierte el texto a minúsculas y elimina caracteres diacríticos
 * como acentos para facilitar comparaciones.
 *
 * @param texto - Texto que será normalizado.
 * @returns Texto normalizado sin acentos y en minúsculas.
 *
 * @example
 * normalizarTexto("CAFÉ") // "cafe"
 */
export const normalizarTexto = (texto: string | null | undefined): string => {
    if (!texto || typeof texto !== 'string') return ''
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
}

export const hasSearchQuery = (texto: string | null | undefined): boolean => {
    const trimmed = texto?.trim()
    return Boolean(trimmed && trimmed.length > 0)
}

export const matchesSearchQuery = (value: string | null | undefined, query: string | null | undefined): boolean => {
    if (!hasSearchQuery(query)) return false
    return normalizarTexto(value).includes(normalizarTexto(query))
}
