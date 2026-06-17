export interface Subcategory {
    name: string;
    href: string;
}

export interface Category {
    name: string;
    id: string;
    href: string;
    subcategories: Subcategory[];
}
