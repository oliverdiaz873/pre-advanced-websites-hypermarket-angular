export interface Product {
    id: string;
    name: string;
    description?: string;
    url: string;
    categoria: string;
    precio: number;
    precioTexto: string;
    imagen: string;
    unidad?: string;
    quantity?: number;
}
