export function getUrlFragment(href: string): string {
  return href.split('#')[1] ?? '';
}
