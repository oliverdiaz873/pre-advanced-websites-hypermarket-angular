/**
 * Resolves the full URL for static assets.
 * Angular serves static files from the `assets/` folder,
 * so this helper ensures consistent asset paths across the application.
 *
 * Los recursos del storage backend devuelven rutas same-origin `/uploads/...`
 * (resueltas por `resolveProductImageUrl` con storagePublicUrl dev `''`); se
 * dejan tal cual, igual que las URLs absolutas/externas.
 */
export const getAssetUrl = (path: string) => {
    if (!path) return '';

    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/uploads/')) {
        return path;
    }

    let normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (!normalizedPath.startsWith('/assets/')) {
        normalizedPath = `/assets${normalizedPath}`;
    }

    return normalizedPath;
}
