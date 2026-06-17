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
