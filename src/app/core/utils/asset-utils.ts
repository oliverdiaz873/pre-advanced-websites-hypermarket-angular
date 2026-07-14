/**
 * Resolves the full URL for static assets.
 * Angular serves static files from the `assets/` folder,
 * so this helper ensures consistent asset paths across the application.
 */
export const getAssetUrl = (path: string) => {
    if (!path) return '';

    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    let normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (!normalizedPath.startsWith('/assets/')) {
        normalizedPath = `/assets${normalizedPath}`;
    }

    return normalizedPath;
}
