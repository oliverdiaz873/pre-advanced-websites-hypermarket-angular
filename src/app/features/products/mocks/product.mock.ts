import { ProductUI } from '../models/product-ui.interface';

export const MOCK_PRODUCTS: ProductUI[] = [
    {
        id: "coca_cola",
        nombre: "Coca Cola",
        url: "/product/coca_cola",
        categoria: "bebidas",
        precio: 80,
        precioTexto: "Precio: $80 / 2 Litros",
        imagen: "/assets/images/productos/alimentos/bebidas/refresco/coca-cola.avif",
        unidad: "2 Litros"
    },
    {
        id: "coca_cola_zero",
        nombre: "Coca Cola Zero",
        url: "/product/coca_cola_zero",
        categoria: "bebidas",
        precio: 80,
        precioTexto: "Precio: $80 / 2 Litros",
        imagen: "/assets/images/productos/alimentos/bebidas/refresco/coca-cola-zero.avif",
        unidad: "2 Litros",
        oldPrice: "Precio: $100 / 2 Litros",
        discountPercentage: 20
    },
    {
        id: "country_club_frambuesa",
        nombre: "Country Club Frambuesa",
        url: "/product/country_club_frambuesa",
        categoria: "bebidas",
        precio: 70,
        precioTexto: "Precio: $70 / 2 Litros",
        imagen: "/assets/images/productos/alimentos/bebidas/refresco/country-club-frambuesa.avif",
        unidad: "2 Litros"
    },
    {
        id: "country_club_uva",
        nombre: "Country Club Uva",
        url: "/product/country_club_uva",
        categoria: "bebidas",
        precio: 70,
        precioTexto: "Precio: $70 / 2 Litros",
        imagen: "/assets/images/productos/alimentos/bebidas/refresco/country-club-uva.avif",
        unidad: "2 Litros",
        oldPrice: "Precio: $90 / 2 Litros",
        discountPercentage: 22
    }
];
