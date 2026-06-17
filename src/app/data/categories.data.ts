import { Category } from '@core/types/category.interface'

export const categories: Category[] = [
    {
        name: 'Alimentos',
        id: 'alimentos',
        href: '/category/alimentos',
        subcategories: [
            { name: 'Frutas y Verduras', href: '/category/alimentos#frutas-y-verduras' },
            { name: 'Despensa', href: '/category/alimentos#despensa' },
            { name: 'Carnes, Pescados y Mariscos', href: '/category/alimentos#carnes-pescados-mariscos' },
            { name: 'Lácteos y Huevos', href: '/category/alimentos#lacteos-y-huevos' },
            { name: 'Bebidas', href: '/category/alimentos#bebidas' },
            { name: 'Enlatados', href: '/category/alimentos#enlatados' },
        ],
    },
    {
        name: 'Electrodomésticos',
        id: 'electrodomesticos',
        href: '/category/electrodomesticos',
        subcategories: [
            { name: 'Cocina', href: '/category/electrodomesticos#cocina' },
            { name: 'Lavado', href: '/category/electrodomesticos#lavado' },
            { name: 'Climatización', href: '/category/electrodomesticos#climatizacion' },
        ],
    },
    {
        name: 'Tecnología',
        id: 'tecnologia',
        href: '/category/tecnologia',
        subcategories: [
            { name: 'Televisores', href: '/category/tecnologia#televisores' },
            { name: 'Laptops', href: '/category/tecnologia#laptops' },
            { name: 'Tablets', href: '/category/tecnologia#tablets' },
            { name: 'Celulares', href: '/category/tecnologia#celulares' },
            { name: 'Bocinas', href: '/category/tecnologia#bocinas' },
        ],
    },
    {
        name: 'Ropa',
        id: 'ropa',
        href: '/category/ropa',
        subcategories: [
            { name: 'Pantalones para Hombres', href: '/category/ropa#pantalones-para-hombres' },
            { name: 'Pantalones para Mujeres', href: '/category/ropa#pantalones-para-mujeres' },
            { name: 'Pantalones para Niños', href: '/category/ropa#pantalones-para-ninos' },
            { name: 'Trajes para Hombres', href: '/category/ropa#trajes-para-hombres' },
            { name: 'Vestidos', href: '/category/ropa#vestidos' },
        ],
    },
    {
        name: 'Muebles y Decoración',
        id: 'muebles-y-decoracion',
        href: '/category/muebles-y-decoracion',
        subcategories: [
            { name: 'Sofás', href: '/category/muebles-y-decoracion#sofas' },
            { name: 'Sillones', href: '/category/muebles-y-decoracion#sillones' },
            { name: 'Mesas', href: '/category/muebles-y-decoracion#mesas' },
            { name: 'Floreros', href: '/category/muebles-y-decoracion#floreros' },
        ],
    },
    {
        name: 'Farmacia',
        id: 'farmacia',
        href: '/category/farmacia',
        subcategories: [
            { name: 'Analgésicos', href: '/category/farmacia#analgesicos' },
            { name: 'Dermocosmética', href: '/category/farmacia#dermocosmetica' },
            { name: 'Vitaminas y Minerales', href: '/category/farmacia#vitaminas-y-minerales' },
            { name: 'Antigripales', href: '/category/farmacia#antigripales-y-resfriado' },
        ],
    },
    {
        name: 'Ferretería',
        id: 'ferreteria',
        href: '/category/ferreteria',
        subcategories: [
            { name: 'Herramientas Manuales', href: '/category/ferreteria#herramientas-manuales' },
            { name: 'Pinturas', href: '/category/ferreteria#pinturas-y-acabados' },
            { name: 'Electricidad', href: '/category/ferreteria#electricidad' },
            { name: 'Plomería', href: '/category/ferreteria#plomeria' },
        ],
    },
    {
        name: 'Juguetes',
        id: 'juguetes',
        href: '/category/juguetes',
        subcategories: [
            { name: 'Juguetes para Niños', href: '/category/juguetes#juguetes-para-ninos' },
            { name: 'Juguetes para Niñas', href: '/category/juguetes#juguetes-para-ninas' },
        ],
    },
]
