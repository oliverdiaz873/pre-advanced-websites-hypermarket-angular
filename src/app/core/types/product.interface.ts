export interface Product {
    id: string;
    name: string;
    description?: string;
    url: string;
    categoria: string;
    subcategoryId?: string | null;
    precio: number;
    precioTexto: string;
    imagen: string;
    unidad?: string;
    quantity?: number;
}
