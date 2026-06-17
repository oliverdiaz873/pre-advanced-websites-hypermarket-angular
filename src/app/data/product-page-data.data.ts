/**
 * productPageData.ts
 *
 * Propósito: Contiene el contenido editorial exclusivo de las páginas de detalle
 * de cada producto: párrafo de descripción y lista de características (detalles).
 *
 * ¿Por qué existe separado de productos.ts?
 * productos.ts guarda los datos estructurales que usa toda la app (precio, imagen,
 * categoría, URL). Este archivo guarda únicamente el contenido largo que solo
 * necesita la página /product/:id — mantenerlos separados evita cargar texto
 * innecesario en el resto de la aplicación.
 *
 * Convención de claves: el productId debe coincidir exactamente con el campo `id`
 * en productos.ts. Los productos sin entrada aquí usan un fallback genérico
 * definido en ProductDetailSection.tsx.
 *
 * Migración por fases:
 *   Fase 1 – Alimentos
 *   Fase 2 – Electrodomésticos
 *   Fase 3 – Tecnología
 *   Fase 4 – Farmacia
 *   Fase 5 – Ferretería
 *   Fase 6 – Juguetes
 *   Fase 7 – Muebles y Decoración
 *   Fase 8 – Ropa
 */

export interface ProductPageData {
    descripcion: string
    detalles: string[]
}

export const productPageData: Record<string, ProductPageData> = {

    // ─── ALIMENTOS / BEBIDAS ───────────────────────────────────────────────────

    coca_cola: {
        descripcion: 'Coca Cola es la bebida refrescante más icónica del mundo. Disfruta de su sabor único, burbujeante y refrescante que acompaña los mejores momentos de tu vida.',
        detalles: [
            'Sabor: Original',
            'Calorías: 140 kcal',
            'Presentación: Botella de 2 Litros',
            'Ideal para: Acompañar cualquier momento',
            'Temperatura recomendada: Fría',
        ],
    },

    coca_cola_zero: {
        descripcion: 'Coca Cola Zero es la opción perfecta para quienes buscan el sabor original de Coca-Cola pero sin azúcar y sin calorías. Refréscate con la chispa de siempre, ahora más ligera.',
        detalles: [
            'Sabor: Original (Zero Sugar)',
            'Calorías: 0 kcal',
            'Azúcares: 0g',
            'Presentación: Botella de 2 Litros',
            'Ideal para: Acompañar cualquier momento',
        ],
    },

    country_club_frambuesa: {
        descripcion: 'Country Club Frambuesa es el refresco dominicano por excelencia, con su característico sabor a frambuesa que encanta a todos. Ideal para compartir en familia y amigos.',
        detalles: [
            'Sabor: Frambuesa',
            'Presentación: Botella de 2 Litros',
            'Beneficios: Sabor único y refrescante',
            'Ideal para: Fiestas, comidas y meriendas',
            'Tamaño: 2 Litros',
        ],
    },

    country_club_uva: {
        descripcion: 'Country Club Uva ofrece un sabor intenso y dulce que encanta a todos. Disfruta de la frescura de la uva en cada sorbo. Perfecto para cualquier ocasión.',
        detalles: [
            'Sabor: Uva',
            'Presentación: Botella de 2 Litros',
            'Beneficios: Sabor intenso y dulce',
            'Ideal para: Acompañar comidas y meriendas',
            'Tamaño: 2 Litros',
        ],
    },

    gatorade_uva: {
        descripcion: 'Gatorade Uva es la bebida deportiva científicamente formulada para reponer los electrolitos perdidos durante el entrenamiento físico. Mantente hidratado y al máximo rendimiento.',
        detalles: [
            'Sabor: Uva',
            'Tipo: Bebida Isotónica',
            'Beneficios: Repone electrolitos y energía',
            'Ideal para: Deportes y actividad física intensa',
            'Presentación: Botella de 600ml',
        ],
    },

    jugo_de_naranja_rica: {
        descripcion: 'El Jugo de Naranja Rica es 100% natural, sin conservantes y lleno de vitaminas. La mejor opción para empezar tu día con energía y sabor real a frutas.',
        detalles: [
            'Sabor: Naranja',
            'Tipo: Jugo Natural',
            'Beneficios: Rico en vitamina C',
            'Ideal para: Desayunos y meriendas',
            'Presentación: Botella de 1 Litro',
        ],
    },

    jugo_de_pera_santal: {
        descripcion: 'Jugo de Pera Santal ofrece una experiencia de suavidad y dulzura. Hecho con las mejores peras, es una opción ligera y refrescante para toda la familia.',
        detalles: [
            'Sabor: Pera',
            'Tipo: Néctar',
            'Beneficios: Dulce y ligero',
            'Ideal para: Loncheras y meriendas',
            'Presentación: Botella de 1 Litro',
        ],
    },

    red_bull: {
        descripcion: 'Red Bull es la bebida energética líder en el mundo. Con su fórmula única, te da las alas que necesitas para mantenerte activo, concentrado y con energía en todo momento.',
        detalles: [
            'Tipo: Bebida Energética',
            'Cafeína: 80mg',
            'Vitaminas: B3, B5, B6, B12',
            'Ideal para: Deportes, estudio y jornadas largas',
            'Presentación: Lata de 250ml',
        ],
    },

    // ─── ALIMENTOS / CARNES, PESCADOS Y MARISCOS ─────────────────────────────

    camarones_crudos: {
        descripcion: 'Camarones Crudos de alta calidad, perfectos para preparar a tu gusto. Ideales para cócteles, ceviches, paellas o al ajillo. Frescura garantizada.',
        detalles: [
            'Tipo: Marisco',
            'Estado: Crudo',
            'Ideal para: Platos gourmet y caseros',
            'Venta: Por libra',
            'Calidad: Premium',
        ],
    },

    camarones_precocidos: {
        descripcion: 'Camarones Precocidos listos para servir. Perfectos para ensaladas, cócteles o platos rápidos sin necesidad de cocción prolongada.',
        detalles: [
            'Tipo: Marisco',
            'Estado: Precocido',
            'Ideal para: Ensaladas y platos fríos',
            'Venta: Por libra',
            'Calidad: Premium',
        ],
    },

    carne_de_res_para_hamburguesas: {
        descripcion: 'Carne de Res fresca y de primera calidad, ideal para preparar las mejores hamburguesas caseras. Molida al momento para garantizar frescura y sabor.',
        detalles: [
            'Tipo: Carne de Res',
            'Corte: Especial para hamburguesas',
            'Estado: Fresco',
            'Venta: Por libra',
            'Ideal para: Hamburguesas y albóndigas',
        ],
    },

    chuleta_de_cerdo: {
        descripcion: 'Chuleta de Cerdo fresca, jugosa y llena de sabor. Perfecta para asar a la plancha, al horno o frita. Una delicia para toda la familia.',
        detalles: [
            'Tipo: Carne de Cerdo',
            'Corte: Chuleta',
            'Estado: Fresco',
            'Venta: Por libra',
            'Ideal para: Asados, fritos y horneados',
        ],
    },

    pollo_entero_don_pollo: {
        descripcion: 'Pollo Entero Don Pollo, criado con los más altos estándares de calidad. Versátil y sabroso, perfecto para preparar tu plato favorito.',
        detalles: [
            'Tipo: Pollo Entero',
            'Marca: Don Pollo',
            'Estado: Fresco',
            'Venta: Por unidad',
            'Ideal para: Asado, al horno y sopas',
        ],
    },

    tilapia_roja: {
        descripcion: 'Tilapia Roja fresca, rica en proteínas y baja en grasa. Perfecta para preparaciones al vapor, fritas o en caldo. Una opción saludable y deliciosa.',
        detalles: [
            'Tipo: Pescado',
            'Variedad: Tilapia Roja',
            'Estado: Fresco',
            'Venta: Por libra',
            'Ideal para: Fritos, sopas y al vapor',
        ],
    },

    // ─── ALIMENTOS / DESPENSA ─────────────────────────────────────────────────

    aceite_crisol: {
        descripcion: 'Aceite Crisol, el aceite vegetal de confianza para tus preparaciones diarias. Ideal para freír, saltear y aderezar tus platos favoritos.',
        detalles: [
            'Tipo: Aceite Vegetal',
            'Marca: Crisol',
            'Uso: Freír, saltear y cocinar',
            'Presentación: Botella de 1 Litro',
            'Sin colesterol',
        ],
    },

    aceite_oliva_extra_virgen: {
        descripcion: 'Aceite de Oliva Extra Virgen de primera extracción en frío. Ideal para aderezos, ensaladas y cocina mediterránea. Un producto premium para tu cocina.',
        detalles: [
            'Tipo: Aceite de Oliva',
            'Categoría: Extra Virgen',
            'Extracción: Prensado en frío',
            'Uso: Aderezos y cocina fina',
            'Presentación: Botella de 750ml',
        ],
    },

    mayonesa_baldom: {
        descripcion: 'Mayonesa Baldom, el sabor clásico de la mayonesa dominicana. Cremosa y deliciosa, perfecta para acompañar todos tus platos y sándwiches.',
        detalles: [
            'Tipo: Mayonesa',
            'Marca: Baldom',
            'Sabor: Clásico',
            'Uso: Sándwiches, ensaladas y aderezos',
            'Presentación: Frasco de 946ml',
        ],
    },

    sal_refisal: {
        descripcion: 'Sal Refisal, la sal de mesa más usada en los hogares dominicanos. Finamente molida para una distribución uniforme en tus recetas.',
        detalles: [
            'Tipo: Sal de Mesa',
            'Marca: Refisal',
            'Textura: Fina',
            'Uso: Cocina y mesa',
            'Presentación: Bolsa de 1 kg',
        ],
    },

    sazon_completo_maggi: {
        descripcion: 'Sazón Completo Maggi, el condimento que no puede faltar en tu cocina. Su mezcla especial de especias da el sabor perfecto a todas tus preparaciones.',
        detalles: [
            'Tipo: Condimento',
            'Marca: Maggi',
            'Mezcla: Especias y hierba',
            'Uso: Carnes, vegetales y sopas',
            'Presentación: Frasco de 400g',
        ],
    },

    sopita_dona_gallina: {
        descripcion: 'Sopita Doña Gallina, el sazonador de pollo más popular de la cocina dominicana. Da a tus platos el sabor casero y auténtico que todos aman.',
        detalles: [
            'Tipo: Sazonador',
            'Marca: Doña Gallina',
            'Sabor: Pollo',
            'Uso: Sopas, arroces y guisos',
            'Presentación: Caja de cubitos',
        ],
    },

    vinagre_baldom: {
        descripcion: 'Vinagre Baldom, el vinagre blanco de uso diario en la cocina dominicana. Ideal para aderezos, conservas y limpieza de vegetales.',
        detalles: [
            'Tipo: Vinagre Blanco',
            'Marca: Baldom',
            'Usos: Aderezos, encurtidos y cocina',
            'Sabor: Ácido suave',
            'Presentación: Botella de 946ml',
        ],
    },

    // ─── ALIMENTOS / ENLATADOS ────────────────────────────────────────────────

    atun_dimar: {
        descripcion: 'Atún Dimar en aceite, fuente de proteínas de alta calidad. Ideal para ensaladas, sándwiches y platos rápidos. Práctico y nutritivo.',
        detalles: [
            'Tipo: Atún en aceite',
            'Marca: Dimar',
            'Proteínas: Alto contenido',
            'Uso: Ensaladas, sándwiches y pasta',
            'Presentación: Lata de 170g',
        ],
    },

    gandules_verdes_goya: {
        descripcion: 'Gandules Verdes Goya, el ingrediente esencial del arroz con gandules. Tiernos y sabrosos, listos para usar directamente de la lata.',
        detalles: [
            'Tipo: Legumbre',
            'Marca: Goya',
            'Estado: Cocido y listo para usar',
            'Uso: Arroz con gandules y guisos',
            'Presentación: Lata de 439g',
        ],
    },

    habichuelas_negras_goya: {
        descripcion: 'Habichuelas Negras Goya, tiernas y sabrosas. Perfectas para hacer moro de habichuelas negras o acompañar tus platos favoritos.',
        detalles: [
            'Tipo: Legumbre',
            'Variedad: Habichuelas Negras',
            'Marca: Goya',
            'Estado: Pre-cocidas',
            'Presentación: Lata de 439g',
        ],
    },

    maiz_la_famosa: {
        descripcion: 'Maíz La Famosa en lata, dulce y tierno. Perfecto para ensaladas, guisos y como acompañante de cualquier plato principal.',
        detalles: [
            'Tipo: Maíz dulce en grano',
            'Marca: La Famosa',
            'Estado: Cocido',
            'Uso: Ensaladas y guisos',
            'Presentación: Lata de 439g',
        ],
    },

    salchichas_jaja: {
        descripcion: 'Salchichas Jaja, las salchichas más populares del mercado dominicano. Jugosas y sabrosas, perfectas para el desayuno, la merienda o cualquier receta.',
        detalles: [
            'Tipo: Salchichas',
            'Marca: Jaja',
            'Uso: Desayuno, merienda y guisos',
            'Estado: Listas para calentar',
            'Presentación: Lata de 400g',
        ],
    },

    sardinas_gord: {
        descripcion: 'Sardinas Gord en salsa de tomate, ricas en Omega-3 y proteínas. Una opción nutritiva y económica para cualquier comida rápida.',
        detalles: [
            'Tipo: Sardinas en salsa de tomate',
            'Marca: Gord',
            'Nutrientes: Rico en Omega-3',
            'Uso: Sandwiches y platos rápidos',
            'Presentación: Lata de 125g',
        ],
    },

    tomates_pelados_la_famosa: {
        descripcion: 'Tomates Pelados La Famosa, enteros y en su jugo natural. Perfectos para preparar salsas, guisos y sopas con sabor casero.',
        detalles: [
            'Tipo: Tomates pelados enteros',
            'Marca: La Famosa',
            'Estado: En jugo natural',
            'Uso: Salsas, guisos y sopas',
            'Presentación: Lata de 794g',
        ],
    },

    // ─── ALIMENTOS / FRUTAS Y VERDURAS ────────────────────────────────────────

    ajies_morrones: {
        descripcion: 'Ajíes Morrones frescos, coloridos y llenos de sabor. Perfectos para ensaladas, salteados y como decoración de tus platos.',
        detalles: [
            'Tipo: Vegetal',
            'Variedad: Morrón',
            'Colores: Rojo, amarillo y verde',
            'Uso: Ensaladas y salteados',
            'Venta: Por unidad',
        ],
    },

    cebollas_rojas: {
        descripcion: 'Cebollas Rojas frescas, con su característico sabor dulce y ligeramente picante. Imprescindibles en la cocina dominicana.',
        detalles: [
            'Tipo: Vegetal',
            'Variedad: Cebolla Roja',
            'Sabor: Dulce y ligeramente picante',
            'Uso: Ensaladas, guisos y condimentos',
            'Venta: Por libra',
        ],
    },

    fresas: {
        descripcion: 'Fresas frescas, dulces y aromáticas. Perfectas para postres, smoothies o disfrutarlas solas como snack saludable.',
        detalles: [
            'Tipo: Fruta',
            'Variedad: Fresa',
            'Sabor: Dulce y ácido',
            'Uso: Postres, batidos y snacks',
            'Presentación: Paquete de 250g',
        ],
    },

    limones_persa: {
        descripcion: 'Limones Persa frescos, con su jugo ácido y aromático. Esenciales para aderezar ensaladas, marinar carnes y preparar limonada.',
        detalles: [
            'Tipo: Fruta cítrica',
            'Variedad: Persa',
            'Sabor: Ácido',
            'Uso: Jugos, aderezos y marinadas',
            'Venta: Por libra',
        ],
    },

    mandarinas: {
        descripcion: 'Mandarinas dulces y fáciles de pelar. Una fruta rica en vitamina C, perfecta como snack saludable para toda la familia.',
        detalles: [
            'Tipo: Fruta cítrica',
            'Variedad: Mandarina',
            'Sabor: Dulce',
            'Beneficios: Rica en vitamina C',
            'Venta: Por libra',
        ],
    },

    manzanas_amarillas: {
        descripcion: 'Manzanas Amarillas dulces y jugosas. Una fruta versátil perfecta para comer sola, en ensaladas de frutas o en postres.',
        detalles: [
            'Tipo: Fruta',
            'Variedad: Manzana Amarilla',
            'Sabor: Dulce y jugoso',
            'Uso: Snack, ensaladas y postres',
            'Venta: Por unidad',
        ],
    },

    manzanas_rojas: {
        descripcion: 'Manzanas Rojas, crujientes y con un sabor equilibrado entre dulce y ácido. Una fruta clásica que nunca falla.',
        detalles: [
            'Tipo: Fruta',
            'Variedad: Manzana Roja',
            'Sabor: Dulce-ácido',
            'Beneficios: Rica en fibra y antioxidantes',
            'Venta: Por unidad',
        ],
    },

    manzanas_verdes: {
        descripcion: 'Manzanas Verdes con su particular sabor ácido y refrescante. Perfectas para snacks, jugos y recetas de repostería.',
        detalles: [
            'Tipo: Fruta',
            'Variedad: Manzana Verde',
            'Sabor: Ácido y refrescante',
            'Uso: Jugos, snacks y repostería',
            'Venta: Por unidad',
        ],
    },

    pepinos: {
        descripcion: 'Pepinos frescos y crujientes. Bajos en calorías e hidratantes, son el ingrediente perfecto para ensaladas y platos fríos.',
        detalles: [
            'Tipo: Vegetal',
            'Variedad: Pepino',
            'Sabor: Fresco y suave',
            'Beneficios: Hidratante y bajo en calorías',
            'Venta: Por unidad',
        ],
    },

    tomates_de_ensalada: {
        descripcion: 'Tomates de Ensalada frescos, rojos y jugosos. El ingrediente base de cualquier ensalada y plato mediterráneo.',
        detalles: [
            'Tipo: Vegetal',
            'Variedad: Tomate de Ensalada',
            'Sabor: Dulce y ácido',
            'Uso: Ensaladas, sándwiches y guisos',
            'Venta: Por libra',
        ],
    },

    uvas_moradas: {
        descripcion: 'Uvas Moradas dulces y refrescantes. Una fruta deliciosa como snack o para preparar jugos y postres especiales.',
        detalles: [
            'Tipo: Fruta',
            'Variedad: Uva Morada',
            'Sabor: Dulce',
            'Uso: Snack, jugos y postres',
            'Venta: Por libra',
        ],
    },

    zanahorias: {
        descripcion: 'Zanahorias frescas, crujientes y ricas en betacaroteno. Perfectas para ensaladas, jugos o como snack saludable.',
        detalles: [
            'Tipo: Vegetal',
            'Variedad: Zanahoria',
            'Beneficios: Rica en vitamina A',
            'Uso: Ensaladas, jugos y sopas',
            'Venta: Por libra',
        ],
    },

    // ─── ALIMENTOS / LÁCTEOS Y HUEVOS ─────────────────────────────────────────

    huevos_don_pancho: {
        descripcion: 'Huevos Don Pancho, frescos y de la más alta calidad. Fuente natural de proteínas y nutrientes esenciales para toda la familia.',
        detalles: [
            'Tipo: Huevos de gallina',
            'Marca: Don Pancho',
            'Tamaño: Grande',
            'Nutrientes: Proteínas y vitaminas',
            'Presentación: Cartón de 30 unidades',
        ],
    },

    leche_entera_rica: {
        descripcion: 'Leche Entera Rica, rica en calcio y proteínas. El alimento esencial para el desarrollo de niños y adultos, con el sabor fresco y natural que todos necesitan.',
        detalles: [
            'Tipo: Leche Entera',
            'Marca: Rica',
            'Nutrientes: Calcio y vitamina D',
            'Pasteurizada: Sí',
            'Presentación: Cartón de 1 Litro',
        ],
    },

    queso_gorgonzola: {
        descripcion: 'Queso Gorgonzola italiano, con su característico sabor fuerte y cremoso. Perfecto para tablas de quesos, pastas y salsas gourmet.',
        detalles: [
            'Tipo: Queso azul',
            'Origen: Italia',
            'Sabor: Fuerte e intenso',
            'Uso: Tablas de queso, pasta y salsas',
            'Venta: Por unidad',
        ],
    },

    queso_gouda: {
        descripcion: 'Queso Gouda holandés, cremoso y de sabor suave. Ideal para sándwiches, tablas de quesos y gratinados.',
        detalles: [
            'Tipo: Queso semiduro',
            'Origen: Holanda',
            'Sabor: Suave y cremoso',
            'Uso: Sándwiches y gratinados',
            'Venta: Por unidad',
        ],
    },

    yogurt_fresa_yoka: {
        descripcion: 'Yogurt de Fresa Yoka, cremoso y delicioso. Con trozos de fresa real, es la merienda perfecta para niños y adultos.',
        detalles: [
            'Tipo: Yogurt con frutas',
            'Sabor: Fresa',
            'Marca: Yoka',
            'Beneficios: Probióticos y calcio',
            'Presentación: Vaso de 150g',
        ],
    },

    yogurt_natural_rica: {
        descripcion: 'Yogurt Natural Rica, sin azúcar añadida y lleno de probióticos. Perfecto para una dieta saludable, solo o mezclado con frutas.',
        detalles: [
            'Tipo: Yogurt Natural',
            'Marca: Rica',
            'Azúcar añadida: Sin',
            'Beneficios: Probióticos y calcio',
            'Presentación: Vaso de 200g',
        ],
    },

    // ─── ELECTRODOMÉSTICOS / CLIMATIZACIÓN ────────────────────────────────────

    'aire-acondicionado_tecnomaster': {
        descripcion: 'El Aire Acondicionado Tecnomaster ofrece un rendimiento confiable y eficiente para mantener cualquier espacio fresco. Diseñado con tecnología moderna que optimiza el consumo energético y brinda un enfriamiento uniforme.',
        detalles: [
            'Alta eficiencia energética',
            'Modo silencioso',
            'Control remoto incluido',
            'Función de temporizador',
            'Diseño moderno y compacto',
        ],
    },

    'aire-acondicionado_whirlpool': {
        descripcion: 'El Aire Acondicionado Whirlpool combina potencia y eficiencia energética en un diseño elegante. Ideal para enfriar grandes espacios con un mínimo consumo eléctrico.',
        detalles: [
            'Potencia de enfriamiento superior',
            'Tecnología inverter de bajo consumo',
            'Función calor/frío reversible',
            'Panel digital con pantalla LED',
            'Filtro de purificación de aire',
        ],
    },

    ventilador_daiwa: {
        descripcion: 'El Ventilador Daiwa ofrece una circulación de aire fresca y silenciosa para cualquier habitación. Perfecto para mantener el confort en el hogar durante los días calurosos.',
        detalles: [
            'Velocidades: 3 niveles',
            'Oscilación automática',
            'Diseño de pedestal regulable',
            'Motor silencioso y eficiente',
            'Fácil de ensamblar',
        ],
    },

    ventilador_kdk: {
        descripcion: 'El Ventilador KDK es reconocido por su durabilidad y su flujo de aire potente. Una opción confiable y económica para refrescar cualquier espacio.',
        detalles: [
            'Velocidades: 3 niveles',
            'Aspas de gran diámetro',
            'Motor de larga vida útil',
            'Diseño clásico y resistente',
            'Bajo consumo eléctrico',
        ],
    },

    ventilador_pequeno: {
        descripcion: 'Ventilador Pequeño compacto e ideal para escritorios, mesas de noche o espacios reducidos. Portátil y de fácil traslado a cualquier lugar del hogar.',
        detalles: [
            'Tamaño compacto y portátil',
            'Velocidades: 2 niveles',
            'Base antideslizante',
            'Bajo nivel de ruido',
            'Fácil limpieza de aspas',
        ],
    },

    ventilador_de_techo_kdk: {
        descripcion: 'Ventilador de Techo KDK para una circulación de aire amplia y eficiente en toda la habitación. Con diseño moderno y motor silencioso, ideal para salas y dormitorios.',
        detalles: [
            'Diámetro de aspas: 56 pulgadas',
            'Motor silencioso de alta eficiencia',
            'Velocidades: 3 niveles',
            'Control remoto incluido',
            'Acabado moderno y elegante',
        ],
    },

    // ─── ELECTRODOMÉSTICOS / COCINA ───────────────────────────────────────────

    nevera_lg: {
        descripcion: 'La Nevera LG combina tecnología de enfriamiento avanzada con un diseño moderno. Su alta eficiencia energética, amplio espacio interior y funcionamiento silencioso la convierten en la elección perfecta para mantener tus alimentos frescos y organizados.',
        detalles: [
            'Capacidad: 18 pies cúbicos',
            'Tecnología: Door Cooling+ y Smart Inverter',
            'Consumo energético: Bajo (A+)',
            'Tipo: Doble puerta',
            'Color: Plateado',
        ],
    },

    estufa_lg: {
        descripcion: 'La Estufa LG de gas ofrece cocción precisa, eficiente y segura. Sus amplias hornillas y encendido eléctrico automático la hacen ideal para cualquier cocina.',
        detalles: [
            'Tipo: Gas natural',
            'Hornillas: 4 quemadores',
            'Encendido: Eléctrico automático',
            'Horno integrado con grill',
            'Parrillas de hierro fundido',
        ],
    },

    'extractor-de-grasa_drija': {
        descripcion: 'El Extractor de Grasa Drija mantiene tu cocina libre de humo, olores y vapores de grasa. Instalación fácil y funcionamiento silencioso para una cocina siempre fresca.',
        detalles: [
            'Tipo: Campana extractora',
            'Marca: Drija',
            'Motor de alta aspiración',
            'Filtros de grasa lavables',
            'Iluminación LED integrada',
        ],
    },

    cilindro_de_gas_duragas: {
        descripcion: 'Cilindro de Gas Duragas, el más confiable del mercado dominicano. Certificado para uso doméstico y comercial, garantizando seguridad y durabilidad en cada uso.',
        detalles: [
            'Marca: Duragas',
            'Capacidad: 25 libras',
            'Certificado para uso doméstico',
            'Material: Acero reforzado',
            'Válvula de seguridad incluida',
        ],
    },

    freezer_7_pies: {
        descripcion: 'Freezer de 7 pies de capacidad, ideal para conservar grandes cantidades de alimentos congelados. Perfecto para hogares y negocios que necesitan mayor espacio de congelación.',
        detalles: [
            'Capacidad: 7 pies cúbicos',
            'Tipo: Congelador horizontal (chest)',
            'Temperatura regulable',
            'Canasta organizadora incluida',
            'Sellado hermético eficiente',
        ],
    },

    bebedero_tecnomaster: {
        descripcion: 'El Bebedero Tecnomaster ofrece agua fría y caliente al instante. Ideal para oficinas, hogares y negocios que buscan comodidad e higiene en la hidratación diaria.',
        detalles: [
            'Agua fría y caliente',
            'Marca: Tecnomaster',
            'Compatible con botellones de 5 galones',
            'Dispensador tipo push',
            'Bandeja removible fácil de limpiar',
        ],
    },

    // ─── ELECTRODOMÉSTICOS / LAVADO ───────────────────────────────────────────

    lavadora_lg: {
        descripcion: 'La Lavadora LG ofrece un lavado profundo, eficiente y silencioso gracias a su motor de tecnología avanzada, ideal para hogares modernos que buscan calidad y durabilidad.',
        detalles: [
            'Capacidad de 18 kg',
            'Motor inverter silencioso',
            'Panel digital inteligente',
            'Múltiples programas de lavado',
            'Alta eficiencia energética',
        ],
    },

    lavadora_frigidaire: {
        descripcion: 'La Lavadora Frigidaire combina eficiencia y capacidad en un tamaño ideal para el hogar. Con múltiples ciclos de lavado y bajo consumo de agua.',
        detalles: [
            'Capacidad: 12 kg',
            'Tipo: Carga frontal',
            'Múltiples ciclos de lavado',
            'Bajo consumo de agua y energía',
            'Panel de control digital',
        ],
    },

    lavadora_dimensions: {
        descripcion: 'La Lavadora Dimensions es la opción económica y confiable para el hogar. Fácil de usar y con excelente desempeño en cada ciclo de lavado.',
        detalles: [
            'Capacidad: 8 kg',
            'Tipo: Carga superior',
            'Agitador central eficiente',
            'Programas: normal, delicado, rápido',
            'Precio accesible',
        ],
    },

    'lavadora-y-secadora_lg': {
        descripcion: 'La combinación perfecta: Lavadora y Secadora LG en un solo equipo. Ahorra espacio y tiempo con tecnología de lavado y secado de última generación.',
        detalles: [
            'Función: Lavar y secar',
            'Capacidad de lavado: 15 kg',
            'Motor inverter de bajo ruido',
            'Secado por vapor',
            'Sistema AI DD (detección de carga)',
        ],
    },

    'lavadora-y-secadora_tecnomaster': {
        descripcion: 'La Lavadora y Secadora Tecnomaster es la solución 2 en 1 que necesitas. Lava y seca en un solo ciclo con eficiencia energética y múltiples programas.',
        detalles: [
            'Función: Lavar y secar',
            'Capacidad: 10 kg',
            'Programas: 14 ciclos',
            'Pantalla LED',
            'Motor silencioso de alta durabilidad',
        ],
    },

    // ─── TECNOLOGÍA / BOCINAS ────────────────────────────────────────────────
    bocina_aiwa: {
        descripcion: "La Bocina Aiwa ofrece un sonido potente y nítido, ideal para cualquier ocasión. Con conectividad Bluetooth de largo alcance, batería de larga duración y un diseño robusto y elegante.",
        detalles: [
            "Conectividad Bluetooth estable",
            "Batería de larga duración",
            "Sonido envolvente de alta calidad",
            "Entrada USB y tarjeta SD",
            "Diseño resistente y portátil",
        ],
    },
    bocina_lg: {
        descripcion: "La Bocina LG ofrece una experiencia auditiva excepcional con tecnología de audio avanzada. Perfecta para disfrutar de tu música favorita con bajos profundos y agudos nítidos, en un diseño moderno y compacto.",
        detalles: [
            "Sonido de alta resolución",
            "Bajos reforzados con tecnología LG",
            "Conectividad Bluetooth multidispositivo",
            "Batería recargable integrada",
            "Protección contra salpicaduras de agua",
        ],
    },
    bocina_samsung: {
        descripcion: "La Bocina Samsung combina un diseño elegante con un rendimiento sonoro potente y equilibrado. Ideal para cualquier ambiente, ofreciendo conectividad sin cables y una calidad de audio superior que llena todo el espacio.",
        detalles: [
            "Sonido Premium de 360 grados",
            "Integración con el ecosistema Samsung",
            "Conexión inalámbrica instantánea",
            "Control mediante aplicación móvil",
            "Acabado sofisticado y minimalista",
        ],
    },
    bocina_stage: {
        descripcion: "La Bocina Stage es la opción perfecta para quienes buscan potencia y claridad en un solo dispositivo. Con un diseño pensado para durar y una autonomía sorprendente, es tu compañera ideal para fiestas y viajes.",
        detalles: [
            "Gran potencia de salida",
            "Modo TWS (True Wireless Stereo)",
            "Resistencia a impactos y polvo",
            "Carga rápida mediante USB-C",
            "Llamadas manos libres integradas",
        ],
    },
    bocina_tecnomaster: {
        descripcion: "La Bocina Tecnomaster ofrece un gran rendimiento a un precio accesible. Con un sonido equilibrado, múltiples opciones de entrada y una batería que te acompaña en tus largas jornadas, es la solución práctica para tu entretenimiento.",
        detalles: [
            "Excelente relación calidad-precio",
            "Radio FM integrada",
            "Múltiples puertos: AUX, USB, SD",
            "Liviana y fácil de transportar",
            "Batería recargable de alta eficiencia",
        ],
    },

    // ─── TECNOLOGÍA / CELULARES ──────────────────────────────────────────────
    celular_samsung_a26: {
        descripcion: "El Samsung A26 es el equilibrio perfecto entre rendimiento y precio. Disfruta de una pantalla fluida, gran batería y un sistema de cámaras versátil diseñado para capturar tus mejores momentos.",
        detalles: [
            "Pantalla Super AMOLED fluida",
            "Batería de larga duración con carga rápida",
            "Sistema de cámara triple de alta resolución",
            "Rendimiento confiable para el día a día",
            "Seguridad avanzada con sensor de huellas",
        ],
    },
    celular_samsung_a35: {
        descripcion: "El Samsung A35 ofrece una experiencia visual envolvente con su pantalla de alta resolución y colores vibrantes. Con un procesador potente y diseño elegante, es la compañía ideal para multitarea y gaming.",
        detalles: [
            "Pantalla Infinity-O con alta tasa de refresco",
            "Procesador potente para juegos y apps",
            "Resistencia al agua y al polvo (certificada)",
            "Cámara principal con estabilización óptica (OIS)",
            "Integración total con servicios de Samsung",
        ],
    },
    celular_s24_ultra: {
        descripcion: "El Samsung S24 Ultra redefine la gama alta con su sistema de cámaras profesional, pantalla de máxima calidad y el potente S-Pen integrado. Diseñado para quienes buscan lo mejor en rendimiento y productividad.",
        detalles: [
            "Pantalla Dynamic AMOLED 2X de última generación",
            "Sistema de cámaras con Zoom espacial avanzado",
            "S-Pen integrado para máxima productividad",
            "Estructura de titanio ultra resistente",
            "Inteligencia Artificial integrada para fotos y traducción",
        ],
    },
    iphone_14: {
        descripcion: "El iPhone 14 ofrece un rendimiento excepcional gracias a su chip avanzado y un sistema de cámaras que captura fotos increíbles en cualquier condición de luz. Seguridad, elegancia y potencia en la palma de tu mano.",
        detalles: [
            "Sistema de dos cámaras avanzado",
            "Modo Cine en resolución 4K Dolby Vision",
            "Ceramic Shield, más resistente que cualquier vidrio",
            "Batería diseñada para durar todo el día",
            "Detección de choques y servicios de emergencia",
        ],
    },
    iphone_14_pro: {
        descripcion: "El iPhone 14 Pro eleva la experiencia móvil con la Dynamic Island, una cámara de 48 MP que captura detalles asombrosos y una pantalla siempre activa de gran brillo. Tecnología e innovación en estado puro.",
        detalles: [
            "Dynamic Island, una forma mágica de interactuar",
            "Cámara Gran Angular de 48 MP con ProRAW",
            "Chip A16 Bionic para un desempeño imbatible",
            "Pantalla ProMotion con Refresh Rate adaptable",
            "Diseño de acero inoxidable de grado quirúrgico",
        ],
    },

    // ─── TECNOLOGÍA / LAPTOPS ────────────────────────────────────────────────
    laptop_asus: {
        descripcion: "La Laptop Asus ofrece potencia y portabilidad para profesionales y estudiantes. Con una pantalla de alta resolución y un rendimiento fluido, es la herramienta ideal para trabajar, estudiar y disfrutar contenido multimedia.",
        detalles: [
            "Procesador de última generación",
            "Pantalla con bordes ultra delgados (NanoEdge)",
            "Teclado ergonómico retroiluminado",
            "Gran autonomía de batería",
            "Chasis ligero y resistente",
        ],
    },
    laptop_dell: {
        descripcion: "La Laptop Dell es sinónimo de confiabilidad y alto rendimiento. Diseñada para soportar largas jornadas de trabajo, ofrece una experiencia de uso fluida gracias a sus componentes de alta gama y diseño robusto.",
        detalles: [
            "Conocida durabilidad y materiales de calidad",
            "Pantalla anti-reflejo de alta definición",
            "Amplia capacidad de almacenamiento y RAM",
            "Excelente soporte y actualizaciones",
            "Teclado resistente a salpicaduras",
        ],
    },
    laptop_dragonx: {
        descripcion: "La Laptop DragonX es la elección de los gamers que buscan el mejor rendimiento. Equipada con gráficos potentes y un sistema de enfriamiento avanzado, te permite disfrutar de tus juegos favoritos sin límites.",
        detalles: [
            "Tarjeta gráfica de alta gama (NVIDIA/AMD)",
            "Sistema de ventilación de alto flujo",
            "Pantalla con alta tasa de refresco para gaming",
            "Teclado mecánico/membrana optimizado",
            "Diseño agresivo con iluminación RGB",
        ],
    },
    laptop_hp: {
        descripcion: "La Laptop HP combina un diseño elegante con funciones inteligentes que facilitan tu día a día. Potente, versátil y segura, es ideal para quienes buscan un equipo equilibrado para la oficina o el hogar.",
        detalles: [
            "Diseño elegante con acabados premium",
            "Cámara HD con obturador de privacidad",
            "Carga rápida optimizada",
            "Audio de alta fidelidad (B&O u otros)",
            "Seguridad integrada por hardware",
        ],
    },
    laptop_lenovo: {
        descripcion: "La Laptop Lenovo destaca por su versatilidad y eficiencia. Ya sea para productividad empresarial o uso creativo, sus funciones avanzadas y diseño inteligente te permiten lograr más en menos tiempo.",
        detalles: [
            "Famoso teclado AccuType para mayor comodidad",
            "Bisagra de apertura de 180 grados",
            "Batería de larga duración con carga rápida",
            "Software de optimización de sistema Lenovo",
            "Excelente relación portabilidad-desempeño",
        ],
    },

    // ─── TECNOLOGÍA / TABLETS ────────────────────────────────────────────────
    tablet_apple: {
        descripcion: "La Tablet Apple combina rendimiento excepcional, pantalla de alta resolución y una experiencia fluida diseñada para trabajar, estudiar y disfrutar contenido multimedia con la mejor calidad.",
        detalles: [
            "Pantalla Retina de alta resolución",
            "Procesador Apple rápido y eficiente",
            "Ecosistema fluido con iCloud y App Store",
            "Batería de larga duración",
            "Diseño premium, ligero y resistente",
        ],
    },
    tablet_rted: {
        descripcion: "La Tablet RTED ofrece un rendimiento confiable con excelente fluidez para multitarea. Perfecta para estudiar, trabajar y disfrutar contenidos multimedia gracias a su pantalla de alta definición, procesador eficiente y diseño portátil.",
        detalles: [
            "Excelente relación calidad-precio",
            "Pantalla amplia y nítida",
            "Ideal para navegación y apps educativas",
            "Memoria expandible mediante microSD",
            "Batería optimizada para el día a día",
        ],
    },
    tablet_samsung: {
        descripcion: "La Tablet Samsung es una excelente opción para quienes buscan rendimiento, fluidez y una pantalla de alta calidad. Perfecta para estudiar, trabajar y disfrutar contenido multimedia gracias a su diseño moderno, batería duradera y ecosistema Samsung.",
        detalles: [
            "Pantalla vibrante con tecnología AMOLED/LCD",
            "Procesador potente para multitarea",
            "Compatibilidad con S-Pen (según modelo)",
            "Modo DeX para experiencia de escritorio",
            "Integración con el ecosistema Galaxy",
        ],
    },
    tablet_tcl: {
        descripcion: "La Tablet TCL ofrece un excelente equilibrio entre rendimiento y portabilidad. Ideal para estudiar, trabajar o disfrutar contenido multimedia gracias a su pantalla brillante, procesador eficiente y batería de larga duración.",
        detalles: [
            "Tecnología de pantalla protectora de vista",
            "Experiencia visual envolvente",
            "Ligera y fácil de transportar",
            "Interfaz amigable y rápida",
            "Conectividad Wi-Fi estable",
        ],
    },
    tablet_tecnomaster: {
        descripcion: "La Tablet Tecnomaster es ideal para usuarios que buscan una excelente relación entre rendimiento, portabilidad y funciones para el día a día. Diseñada para estudiar, trabajar y consumir contenido con fluidez y gran autonomía.",
        detalles: [
            "Rendimiento confiable para el trabajo",
            "Pantalla de alta definición",
            "Diseño robusto y duradero",
            "Varias opciones de conectividad",
            "Excelente duración de batería",
        ],
    },

    // ─── TECNOLOGÍA / TELEVISORES ────────────────────────────────────────────
    televisor_led_50: {
        descripcion: "El Televisor LED de 50 pulgadas ofrece una excelente experiencia visual gracias a su amplia pantalla, colores intensos y resolución nítida. Ideal para salas, habitaciones o espacios donde busques una pantalla grande con gran rendimiento.",
        detalles: [
            "Pantalla LED de 50 pulgadas",
            "Excelente nitidez y colores brillantes",
            "Interfaz moderna y fácil de usar",
            "Compatible con múltiples dispositivos",
            "Diseño elegante y delgado",
        ],
    },
    televisor_led_lg: {
        descripcion: "El Televisor LED LG ofrece una imagen nítida con colores realistas gracias a su avanzado panel LED. Cuenta con sistema Smart TV para acceder a tus aplicaciones favoritas y un diseño moderno que se adapta a cualquier espacio.",
        detalles: [
            "Tecnología de panel IPS para mejores ángulos",
            "Procesador de imagen con IA integrada",
            "Sonido envolvente de alta fidelidad",
            "Sistema operativo WebOS fluido",
            "Control remoto por voz inteligente",
        ],
    },
    televisor_led_samsung: {
        descripcion: "El Televisor LED Samsung ofrece una experiencia visual clara y vibrante, ideal para salas, dormitorios o espacios de entretenimiento. Con calidad Full HD/4K (según modelo) y acceso a aplicaciones inteligentes, es perfecto para disfrutar tus series, juegos y películas.",
        detalles: [
            "Colores vibrantes con tecnología Crystal LED",
            "Diseño sin bordes en tres lados",
            "Mando a distancia único para todos tus dispositivos",
            "Compatible con asistentes de voz",
            "Modo de juego automático para mayor fluidez",
        ],
    },
    televisor_led_tecnomaster: {
        descripcion: "El Televisor LED Tecnomaster combina buena calidad de imagen con un diseño elegante. Su panel LED ofrece colores intensos, excelente brillo y nitidez. Ideal para disfrutar tus programas, películas y contenido favorito con un rendimiento estable.",
        detalles: [
            "Resolución de alta definición",
            "Sintonizador digital integrado",
            "Múltiples entradas HDMI y USB",
            "Diseño robusto y duradero",
            "Bajo consumo de energía",
        ],
    },
    televisor_samsung_75_pulgadas: {
        descripcion: "El Televisor Samsung de 75 pulgadas ofrece una experiencia visual impresionante con resolución Ultra HD 4K, colores vibrantes y tecnologías avanzadas de imagen. Ideal para salas grandes, gaming y cine en casa.",
        detalles: [
            "Pantalla gigante de 75 pulgadas LED",
            "Resolución 4K UHD para detalles asombrosos",
            "Tecnología HDR para colores más realistas",
            "Smart TV con acceso a tus apps favoritas",
            "Diseño refinado que complementa cualquier espacio",
        ],
    },


    // ─── FARMACIA / ANALGÉSICOS ──────────────────────────────────────────────

    tylenol: {
        descripcion: 'Tylenol Analgésico es eficaz para aliviar dolores leves y moderados. Seguro y confiable para el uso diario según indicaciones del envase.',
        detalles: [
            'Tipo: Analgésico',
            'Presentación: Tabletas / Cápsulas',
            'Dosis recomendada: Según indicaciones del envase',
            'Contenido: 20 unidades',
            'Beneficios: Alivio el dolor, seguro, confiable y fácil de usar',
        ],
    },

    equate_analgesico: {
        descripcion: 'El Analgésico Equate proporciona un alivio efectivo contra el dolor y la fiebre. Una opción económica y de alta calidad para el botiquín del hogar.',
        detalles: [
            'Marca: Equate',
            'Uso: Alivio de dolor y fiebre',
            'Presentación: Tabletas',
            'Eficacia comprobada',
            'Relación calidad-precio excelente',
        ],
    },

    flanax: {
        descripcion: 'Flanax Analgésico es potente para el alivio de dolores musculares, de espalda y articulares. Su efecto prolongado permite retomar las actividades diarias sin molestias.',
        detalles: [
            'Efecto prolongado (hasta 12 horas)',
            'Ideal para dolores musculares y articulares',
            'Reduce la inflamación',
            'Fácil de ingerir',
            'Resultados rápidos',
        ],
    },

    thera_gesic: {
        descripcion: 'Thera-Gesic es una crema analgésica de acción tópica que penetra profundamente para aliviar el dolor muscular y de articulaciones al instante.',
        detalles: [
            'Tipo: Crema tópica',
            'Acción rápida y profunda',
            'No grasosa',
            'Ideal para deportistas',
            'Alivio local del dolor',
        ],
    },

    vaporizing: {
        descripcion: 'Vaporizing es un ungüento tópico que ayuda a aliviar la congestión nasal y la tos, además de proporcionar alivio a dolores musculares leves.',
        detalles: [
            'Uso: Tópico e inhalatorio',
            'Alivia la congestión y la tos',
            'Efecto refrescante',
            'Ideal para resfriados',
            'Multiuso',
        ],
    },

    // ─── FARMACIA / ANTIGRIPALES Y RESFRIADO ──────────────────────────────────

    theraflu: {
        descripcion: 'Theraflu es un medicamento diseñado para aliviar los síntomas del resfriado y la gripe, proporcionando alivio rápido y comodidad durante el día y la noche.',
        detalles: [
            'Tipo: Antigripal en polvo',
            'Preparación: Disolver en agua caliente',
            'Beneficios: Alivio reconfortante, descongestionante',
            'Sabor: Limón miel',
            'Contenido: 6 sobres',
        ],
    },

    antiflu_des: {
        descripcion: 'Antiflu-Des es un antigripal de múltiple acción que combate los síntomas del resfriado, incluyendo la fiebre y el malestar general.',
        detalles: [
            'Acción múltiple',
            'Combate fiebre y malestar',
            'Dosis: 1 cápsula cada 8 horas',
            'Marca reconocida',
            'Alivio integral',
        ],
    },

    coldyflu: {
        descripcion: 'Coldyflu ofrece una fórmula avanzada para el alivio de la gripe y el resfriado común, ayudando a despejar las vías respiratorias.',
        detalles: [
            'Fórmula avanzada',
            'Despeja vías respiratorias',
            'Ideal para resfriado común',
            'Efecto rápido',
            'Presentación en comprimidos',
        ],
    },

    mucinex: {
        descripcion: 'Mucinex ayuda a aflojar la mucosidad y adelgazar las secreciones bronquiales para que la tos sea más productiva y las vías respiratorias se limpien.',
        detalles: [
            'Expectorante potente',
            'Alivia la congestión de pecho',
            'Duración: Hasta 12 horas',
            'Facilita la respiración',
            'Tabletas de liberación prolongada',
        ],
    },

    nyquil: {
        descripcion: 'NyQuil proporciona un alivio nocturno para los peores síntomas del resfriado y la gripe, ayudándote a descansar mejor para despertar renovado.',
        detalles: [
            'Alivio nocturno',
            'Ayuda a descansar mejor',
            'Combate tos, dolor y fiebre',
            'Sabor reconfortante',
            'Ideal para uso antes de dormir',
        ],
    },

    // ─── FARMACIA / DERMOCOSMÉTICA ────────────────────────────────────────────

    hidratante_cerave: {
        descripcion: 'La Crema Hidratante Cerave es ideal para pieles secas a muy secas, proporcionando hidratación profunda y restaurando la barrera protectora de la piel.',
        detalles: [
            'Tipo: Crema hidratante corporal y facial',
            'Ingredientes: 3 ceramidas esenciales, Ácido hialurónico',
            'Tecnología: MVE para liberación prolongada de hidratación',
            'Beneficios: No comedogénica, sin perfume, apta para todo tipo de piel',
            'Contenido: 340g',
        ],
    },

    acido_hialuronico: {
        descripcion: 'El Ácido Hialurónico en serum ayuda a mantener la piel hidratada, firme y con un aspecto más joven, reduciendo las líneas de expresión.',
        detalles: [
            'Hidratación intensa',
            'Reduce líneas de expresión',
            'Para todo tipo de piel',
            'Textura ligera y absorción rápida',
            'Efecto reafirmante',
        ],
    },

    hidratante_eucerin: {
        descripcion: 'Eucerin Hidratante es una fórmula dermatológica diseñada para proteger y fortalecer la barrera de la piel, ideal para pieles sensibles.',
        detalles: [
            'Dermatológicamente probado',
            'Ideal para piel sensible',
            'Sin fragancias ni colorantes',
            'Fortalece la piel',
            'Hidratación de larga duración',
        ],
    },

    hidratante_grande: {
        descripcion: 'CeraVe Crema Hidratante en presentación grande, perfecta para el cuidado diario de toda la familia, asegurando hidratación continua.',
        detalles: [
            'Presentación: XL (454g)',
            'Larga duración',
            'Mismos beneficios Cerave',
            'Ideal para uso familiar',
            'Cuidado corporal completo',
        ],
    },

    retinol: {
        descripcion: 'El Retinol ayuda a renovar la superficie de la piel y a mejorar su textura, reduciendo manchas y signos de la edad de manera efectiva.',
        detalles: [
            'Antienvejecimiento',
            'Mejora la textura de la piel',
            'Reduce manchas oscuras',
            'Estimula la renovación celular',
            'Uso nocturno recomendado',
        ],
    },

    serum_vitaminac: {
        descripcion: 'El Serum de Vitamina C aporta luminosidad y protección antioxidante a la piel, ayudando a unificar el tono y prevenir el daño ambiental.',
        detalles: [
            'Antioxidante potente',
            'Aporta luminosidad instantánea',
            'Unifica el tono de piel',
            'Protección contra radicales libres',
            'Ligero y de fácil aplicación',
        ],
    },

    // ─── FARMACIA / VITAMINAS Y MINERALES ─────────────────────────────────────

    multivitaminico: {
        descripcion: 'Suplemento completo que proporciona una amplia gama de vitaminas y minerales esenciales para mantener la energía y el bienestar general diario.',
        detalles: [
            'Tipo: Suplemento vitamínico diario',
            'Referencia: Apoyo a la salud integral',
            'Beneficios: Más energía, mejor rendimiento mental y físico',
            'Modo de uso: Una cápsula al día',
            'Contenido: 60 cápsulas',
        ],
    },

    flintstones: {
        descripcion: 'Multivitamínico Flintstones en gomitas, diseñado específicamente para niños para asegurar que reciban las vitaminas necesarias para su crecimiento.',
        detalles: [
            'Ideal para niños',
            'Presentación: Gomitas masticables',
            'Sabor delicioso a frutas',
            'Apoyo al crecimiento saludable',
            'Contiene vitaminas A, C, D, E',
        ],
    },

    omega3: {
        descripcion: 'El Suplemento de Omega 3 es esencial para la salud cardiovascular y cerebral, proporcionando ácidos grasos de alta pureza.',
        detalles: [
            'Salud cardiovascular',
            'Apoyo a la función cerebral',
            'Cápsulas de gel fáciles de tragar',
            'Alta pureza y concentración',
            'Sin sabor a pescado',
        ],
    },

    vitafusion: {
        descripcion: 'Vitafusion ofrece vitaminas en gomitas para adultos, una forma deliciosa y fácil de complementar la dieta diaria sin pastillas.',
        detalles: [
            'Para adultos',
            'Formato: Gomitas',
            'Complemento dietético',
            'Sabor natural',
            'Fácil de incorporar a la rutina',
        ],
    },

    vitaminac: {
        descripcion: 'La Vitamina C refuerza el sistema inmunológico y actúa como un potente antioxidante para proteger las células del cuerpo.',
        detalles: [
            'Refuerza el sistema inmunológico',
            'Antioxidante esencial',
            'Tabletas masticables',
            'Ayuda a la absorción de hierro',
            'Protección diaria',
        ],
    },

    // ─── FERRETERÍA / ELECTRICIDAD ───────────────────────────────────────────

    bombillas_led: {
        descripcion: 'Ahorra energía con nuestras bombillas LED de larga duración, diseñadas para ofrecer una luz brillante y eficiente.',
        detalles: [
            'Tipo: Tecnología LED',
            'Soporte: E27',
            'Potencia: 9W (equivalente a 75W)',
            'Vida útil: 25,000 horas',
            'Pack: 3 unidades',
        ],
    },

    bombillas: {
        descripcion: 'Ilumina tus espacios con nuestras bombillas incandescentes de alta calidad y rendimiento confiable.',
        detalles: [
            'Tipo: Incandescente',
            'Potencia: 60W',
            'Rosca: E27',
            'Luz cálida',
            'Económicas',
        ],
    },

    extension: {
        descripcion: 'Extensión eléctrica reforzada para interiores y exteriores, ideal para conectar múltiples dispositivos con seguridad.',
        detalles: [
            'Longitud: 5 metros',
            'Tomas: 3 salidas',
            'Calibre: 14 AWG',
            'Uso rudo',
            'Color: Naranja',
        ],
    },

    linterna: {
        descripcion: 'Linterna LED recargable de alta potencia, compacta y resistente al agua, perfecta para emergencias y actividades al aire libre.',
        detalles: [
            'Lúmenes: 1000',
            'Batería: Ion de litio recargable',
            'Modos: Alto, Bajo, Estroboscópico',
            'Resistencia: IPX4',
            'Material: Aluminio aeroespacial',
        ],
    },

    toma_corriente: {
        descripcion: 'Toma corriente doble de pared con diseño moderno y seguridad mejorada para tu hogar u oficina.',
        detalles: [
            'Tipo: Duplex',
            'Voltaje: 125V',
            'Amperaje: 15A',
            'Color: Blanco',
            'Material: Termoplástico resistente',
        ],
    },

    // ─── FERRETERÍA / HERRAMIENTAS MANUALES ───────────────────────────────────

    martillo: {
        descripcion: 'Martillo de uña con mango de fibra de vidrio para una mayor absorción de impactos y durabilidad.',
        detalles: [
            'Tipo: De uña (Carpintero)',
            'Peso: 16 oz',
            'Material: Cabeza de acero forjado',
            'Mango: Fibra de vidrio ergonómica',
            'Marca: Superior Tools',
        ],
    },

    destornillador: {
        descripcion: 'Juego de destornilladores de precisión con puntas magnéticas, ideales para trabajos electrónicos y reparaciones del hogar.',
        detalles: [
            'Kit: 6 piezas',
            'Tipo: Phillips y Planos',
            'Puntas magnéticas',
            'Mango antideslizante',
            'Material: Acero cromo vanadio',
        ],
    },

    llave_de_tuerca: {
        descripcion: 'Llave ajustable de gran apertura, diseñada para máxima versatilidad en trabajos de mecánica y plomería.',
        detalles: [
            'Tamaño: 10 pulgadas',
            'Apertura máxima: 1.5 pulgadas',
            'Escala métrica e imperial',
            'Acero forjado',
            'Acabado cromado',
        ],
    },

    pinza: {
        descripcion: 'Pinza universal con corte lateral, indispensable para electricistas y mantenimiento general.',
        detalles: [
            'Tipo: Universal (Electricista)',
            'Tamaño: 7 pulgadas',
            'Mangos aislados',
            'Capacidad de corte: Alambre duro',
            'Forjado en caliente',
        ],
    },

    sierra_de_mano: {
        descripcion: 'Sierra de mano para madera con dientes templados para un corte rápido y preciso en carpintería.',
        detalles: [
            'Largo: 20 pulgadas',
            'Dientes por pulgada: 8 TPI',
            'Mango ergonómico de madera',
            'Hoja de acero alto carbono',
            'Corte agresivo',
        ],
    },

    // ─── FERRETERÍA / PINTURAS Y ACABADOS ─────────────────────────────────────

    pinturas_tropical: {
        descripcion: 'Pintura acrílica de secado rápido con excelente cobertura y resistencia a la intemperie, perfecta para exteriores.',
        detalles: [
            'Tipo: Acrílica',
            'Uso: Exterior e Interior',
            'Acabado: Mate',
            'Resistencia: Rayos UV y Humedad',
            'Marca: Tropical',
        ],
    },

    pinturas_tucan: {
        descripcion: 'Pintura premium con acabado satinado, lavable y de bajo olor, ideal para interiores y decoración.',
        detalles: [
            'Tipo: Vinil-Acrílica',
            'Acabado: Satinado',
            'Propiedad: Lavable',
            'Bajo VOC (Olor)',
            'Marca: Tucán',
        ],
    },

    brocha: {
        descripcion: 'Brocha profesional de cerdas naturales para un acabado suave y uniforme en cualquier superficie.',
        detalles: [
            'Ancho: 3 pulgadas',
            'Cerdas: 100% naturales',
            'Mango de madera barnizada',
            'Virola de acero inoxidable',
            'Para todo tipo de pinturas',
        ],
    },

    rodillo_de_pintura: {
        descripcion: 'Rodillo de alta densidad para superficies lisas, minimiza el goteo y maximiza la transferencia de pintura.',
        detalles: [
            'Tamaño: 9 pulgadas',
            'Felpa: Poliéster 3/8"',
            'Para pinturas de látex y aceite',
            'Mango ergonómico',
            'Cubierta reemplazable',
        ],
    },

    kit_de_pintura: {
        descripcion: 'Kit completo para pintar que incluye bandeja, rodillo, brocha y cinta adhesiva, todo lo necesario para tu proyecto.',
        detalles: [
            'Incluye: Bandeja, Rodillo (9"), Brocha (2"), Cinta',
            'Material: Plástico resistente',
            'Ideal para principiantes',
            'Ahorro de tiempo',
            'Fácil de limpiar',
        ],
    },

    // ─── FERRETERÍA / PLOMERÍA ────────────────────────────────────────────────

    grifo_moderno: {
        descripcion: 'Grifo monomando con acabado cromado mate, diseño elegante y sistema de ahorro de agua integrado para una eficiencia superior.',
        detalles: [
            'Tipo: Monomando',
            'Acabado: Cromo Mate',
            'Soporte: Ahorro de Agua',
            'Material: Latón de alta pureza',
            'Instalación: Sencilla',
        ],
    },

    grifo: {
        descripcion: 'Grifo tradicional de lavabo con diseño clásico y duradero, fácil de instalar y mantener.',
        detalles: [
            'Tipo: Grifo de bola',
            'Material: Latón cromado',
            'Instalación: Rosca estándar',
            'Larga vida útil',
            'Diseño funcional',
        ],
    },

    manguera_de_jardin: {
        descripcion: 'Manguera de jardín reforzada de triple capa, ultra flexible y resistente a torceduras y climas extremos.',
        detalles: [
            'Longitud: 15 metros',
            'Material: PVC reforzado',
            'Incluye: Boquilla ajustable',
            'Resistencia: 300 PSI',
            'Color: Verde',
        ],
    },

    manguera: {
        descripcion: 'Manguera flexible para conexión de inodoros o lavabos, trenzada en acero inoxidable para evitar fugas.',
        detalles: [
            'Longitud: 16 pulgadas',
            'Trenzado: Acero inoxidable',
            'Tuercas: Latón niquelado',
            'Resistente a la corrosión',
            'Fácil instalación',
        ],
    },

    tubo: {
        descripcion: 'Tubo de PVC de alta presión para drenaje y sistemas sanitarios, ligero y fácil de cortar e instalar.',
        detalles: [
            'Diámetro: 2 pulgadas',
            'Largo: 3 metros',
            'Material: PVC de alta densidad',
            'Uso: Sanitario',
            'Resistente a químicos',
        ],
    },

    // ─── JUGUETES ─────────────────────────────────────────────────────────────

    muneca_barbie: {
        descripcion: "Muñeca Barbie clásica con un vestido elegante y accesorios modernos. Diseñada para inspirar la imaginación y recordar que tú puedes ser lo que quieras.",
        detalles: [
            "Modelo: Barbie Fashionistas",
            "Incluye: Vestido, zapatos y bolso",
            "Material: Plástico de alta calidad",
            "Edad: 3+ años",
            "Marca: Mattel"
        ]
    },
    muneca_baby_doll: {
        descripcion: "Adorable muñeca Baby Doll con accesorios de cuidado. Fomenta la empatía y el juego imaginativo mientras los más pequeños aprenden a cuidar.",
        detalles: [
            "Tipo: Muñeca de Cuidado",
            "Incluye: Biberón y sonajero",
            "Material: Vinilo suave",
            "Edad: 2+ años",
            "Marca: Little Hearts"
        ]
    },
    juguetes_de_peluqueria: {
        descripcion: "Set completo de peluquería de juguete. Incluye un secador que emite aire suave, peines, clips coloridos y un espejo para crear estilos fantásticos y divertidos.",
        detalles: [
            "Contenido: Secador, 2 peines, 4 clips",
            "Funcionalidad: Secador a pilas (no incl.)",
            "Material: Plástico libre de BPA",
            "Edad: 5+ años",
            "Marca: Style Stars"
        ]
    },
    kit_de_maquillaje: {
        descripcion: "Kit de maquillaje artístico para niñas, totalmente lavable y seguro. Incluye sombras, rubores y aplicadores, ideal para fiestas, cumpleaños y juegos de disfraces.",
        detalles: [
            "Tipo: Maquillaje Lavable",
            "Seguridad: No tóxico, dermatológicamente probado",
            "Incluye: Sombras, rubor, 2 aplicadores",
            "Edad: 6+ años",
            "Marca: Glamour Kids"
        ]
    },
    pinta_unas: {
        descripcion: "Set de esmaltes de uñas de colores vibrantes y stickers decorativos. No tóxico, base agua y fácil de remover, perfecto para una tarde de spa y creatividad.",
        detalles: [
            "Contenido: 3 esmaltes, 1 hoja de stickers",
            "Seguridad: No tóxico, lavable",
            "Colores: Rosa, Morado, Azul",
            "Edad: 4+ años",
            "Marca: Little Diva"
        ]
    },
    legos_de_minecraft: {
        descripcion: "Set LEGO Minecraft: La Cabaña-Abeja. Una aventura de construcción llena de posibilidades, con miel, abejas zumbadoras y figuras de personajes para recrear el juego en la vida real.",
        detalles: [
            "Set: La Cabaña-Abeja",
            "Piezas: 251 bloques",
            "Incluye: Apicultor, Osito Zombi, 3 Abejas",
            "Edad: 8+ años",
            "Marca: LEGO / Minecraft"
        ]
    },
    auto_azul: {
        descripcion: "Auto deportivo de color azul brillante, con ruedas de fricción y detalles realistas para horas de diversión a toda velocidad.",
        detalles: [
            "Color: Azul Brillante",
            "Material: Plástico resistente",
            "Sistema: Ruedas de Fricción",
            "Edad: 3+ años",
            "Marca: Speed Master"
        ]
    },
    avion_de_juguete: {
        descripcion: "Avión de juguete con luces y sonidos reales de despegue. Perfecto para pequeños pilotos que aman la aventura en las alturas.",
        detalles: [
            "Tipo: Avión con Efectos",
            "Funciones: Luces LED y Sonido",
            "Material: ABS de alta resistencia",
            "Edad: 4+ años",
            "Marca: Fly High"
        ]
    },
    autos_hot_wheels: {
        descripcion: "Colección de 5 autos Hot Wheels clásicos. Diseños veloces, colores vibrantes y acabados metálicos de alta calidad para coleccionistas y niños por igual.",
        detalles: [
            "Contenido: Pack de 5 autos",
            "Escala: 1:64",
            "Material: Metal y Plástico",
            "Edad: 3+ años",
            "Marca: Hot Wheels / Mattel"
        ]
    },
    legos_de_creeper: {
        descripcion: "Los Legos de Creeper son ideales para los niños amantes de la construcción y de Minecraft. Permiten desarrollar la creatividad, motricidad fina y habilidades de resolución de problemas mientras construyen uno de los personajes más icónicos del juego.",
        detalles: [
            "Serie: Minecraft",
            "Tema: Creeper BigFigure",
            "Edad recomendada: 7+ años",
            "Material: Plástico ABS de alta calidad",
            "Marca: LEGO"
        ]
    },

    // ─── MUEBLES Y DECORACIÓN ────────────────────────────────────────────────

    // Sofás
    sofa_verde: {
        descripcion: "Sofá espacioso en color verde esmeralda. Un mueble imponente que destaca por su color vibrante y su capacidad para acoger a toda la familia con estilo.",
        detalles: [
            "Material: Terciopelo verde esmeralda and madera noble",
            "Capacidad: 4-5 personas",
            "Estilo: Glamour Moderno",
            "Garantía: 3 años",
            "Marca: LuxuryComfort"
        ]
    },
    sofa_gris: {
        descripcion: "Sofá contemporáneo en color gris. Con una estructura robusta y cojines extra suaves, es la elección perfecta para maratones de series y relax familiar.",
        detalles: [
            "Material: Estructura reforzada y tela resistente",
            "Plazas: 3",
            "Confort: Premium",
            "Garantía: 2 años",
            "Marca: UrbanLiving"
        ]
    },
    sofa_media_luna: {
        descripcion: "Sofá con un diseño innovador en media luna. Ideal para crear espacios de conversación acogedores y dinámicos en salas de estar amplias.",
        detalles: [
            "Material: Espuma de alta densidad y tela premium",
            "Forma: Circular / Media Luna",
            "Uso: Salas de estar / Espera",
            "Garantía: 1 año",
            "Marca: UniqueDesign"
        ]
    },
    sofa_negro: {
        descripcion: "Sofá elegante en color negro profundo. Su acabado premium y líneas sofisticadas aportan un toque de lujo industrial a cualquier oficina o sala de estar moderna.",
        detalles: [
            "Material: Cuero sintético premium y metal",
            "Estilo: Industrial Moderno",
            "Acabado: Negro Mate",
            "Garantía: 5 años (estructura)",
            "Marca: EliteFurniture"
        ]
    },
    sofa_cama_blanco: {
        descripcion: "Sofá cama en color blanco puro. Funcionalidad y diseño se unen en esta pieza versátil que se transforma fácilmente para recibir a tus invitados con el máximo confort.",
        detalles: [
            "Material: Estructura de madera y tela suave",
            "Tipo: Sofá Cama",
            "Capacidad: 3 plazas (sofá) / 2 plazas (cama)",
            "Garantía: 2 años",
            "Marca: RelaxHome"
        ]
    },

    // Sillones
    sillon_amarillo: {
        descripcion: "Sillón individual en color amarillo vibrante. Su diseño ergonómico y acolchado de alta densidad garantizan un confort excepcional mientras añades una pieza de acento audaz a tu sala.",
        detalles: [
            "Material: Tela premium y madera",
            "Estilo: Contemporáneo",
            "Ergonomía: Alta",
            "Garantía: 1 año",
            "Marca: ComfortPlus"
        ]
    },
    sillon_azul: {
        descripcion: "Sillón de terciopelo azul profundo. Elegancia clásica combinada con una estructura moderna de patas metálicas, ideal para un rincón de lectura sofisticado.",
        detalles: [
            "Material: Terciopelo y metal",
            "Estilo: Clásico moderno",
            "Uso: Interior",
            "Garantía: 2 años",
            "Marca: EliteFurniture"
        ]
    },
    sillon_blanco: {
        descripcion: "Sillón minimalista en color blanco puro. Su diseño de líneas limpias y tejido resistente a manchas lo hace perfecto para ambientes luminosos y modernos.",
        detalles: [
            "Material: Microfibra y madera",
            "Estilo: Loft Minimalista",
            "Tratamiento: Anti-manchas",
            "Garantía: 1 año",
            "Marca: UrbanDesign"
        ]
    },
    sillon_gris: {
        descripcion: "Sillón contemporáneo en gris jaspeado. Versátil y atemporal, este sillón se adapta a cualquier estilo de decoración ofreciendo una durabilidad superior para el uso diario.",
        detalles: [
            "Material: Lino sintético y madera",
            "Color: Gris jaspeado",
            "Uso: Familiar",
            "Garantía: 2 años",
            "Marca: HomeStyle"
        ]
    },
    sillon_verde: {
        descripcion: "Sillón estilo nórdico en verde olivo. Fabricado con materiales sostenibles, aporta un toque de naturaleza y frescura a tu hogar sin comprometer el estilo.",
        detalles: [
            "Material: Algodón orgánico y roble",
            "Sostenibilidad: Alta",
            "Estilo: Escandinavo",
            "Garantía: 3 años",
            "Marca: EcoLiving"
        ]
    },

    // Mesas
    mesa_de_madera: {
        descripcion: "Mesa de comedor fabricada en madera sólida de roble de alta calidad. Su acabado natural resalta la belleza de la veta, aportando calidez y robustez a tu hogar.",
        detalles: [
            "Material: Roble sólido seleccionado",
            "Acabado: Barniz natural mate",
            "Capacidad: 6-8 comensales",
            "Dimensiones: 180cm x 90cm x 75cm",
            "Marca: WoodMaster"
        ]
    },
    mesa_de_noche: {
        descripcion: "Elegante mesa de noche con un diseño moderno y funcional. Incluye un cajón de suave apertura para mantener tus objetos personales organizados.",
        detalles: [
            "Material: Madera MDF con acabado premium",
            "Cajones: 1 con guías metálicas",
            "Estilo: Minimalista Urbano",
            "Dimensiones: 45cm x 40cm x 55cm",
            "Marca: SleepWell"
        ]
    },
    mesa_moderna: {
        descripcion: "Mesa de centro con diseño vanguardista. Combina superficies de cristal templado con una estructura metálica minimalista para un estilo contemporáneo.",
        detalles: [
            "Material: Cristal templado y acero inoxidable",
            "Estilo: Loft Moderno",
            "Uso: Mesa de centro decorativa",
            "Garantía: 2 años",
            "Marca: UrbanDesign"
        ]
    },
    mesa_oscura: {
        descripcion: "Mesa de comedor imponente en tono ébano profundo. Su diseño sólido y majestuoso está pensado para ser la pieza central de comedores amplios.",
        detalles: [
            "Color: Ébano profundo",
            "Capacidad: 8-10 personas",
            "Resistencia: Alta durabilidad",
            "Estilo: Clásico contemporáneo",
            "Marca: EliteFurniture"
        ]
    },
    mesa_pequena: {
        descripcion: "Mesa auxiliar de diseño exclusivo en mármol. Esta pieza destaca por el uso de materiales de lujo y una artesanía excepcional.",
        detalles: [
            "Material: Mármol de Caoba y latón",
            "Tipo: Edición limitada",
            "Uso: Auxiliar de lujo",
            "Acabado: Pulido a mano",
            "Marca: LuxHome"
        ]
    },

    // Floreros
    florero_de_plantas: {
        descripcion: "Florero de cerámica ideal para plantas de interior. Su diseño minimalista y acabado mate aporta frescura, orden y elegancia a cualquier espacio.",
        detalles: [
            "Material: Cerámica de alta calidad",
            "Estilo: Minimalista Contemporáneo",
            "Dimensiones: 25cm x 12cm",
            "Uso: Interior exclusivamente",
            "Marca: DecorHome"
        ]
    },
    florero_de_vidrio: {
        descripcion: "Florero de vidrio soplado artesanalmente. Su transparencia cristalina resalta la belleza de tus flores naturales, creando un ambiente de arte y sofisticación.",
        detalles: [
            "Material: Vidrio soplado artesanal",
            "Estilo: Clásico Atemporal",
            "Dimensiones: 30cm x 15cm",
            "Características: Alta transparencia, base pesada",
            "Marca: CrystalDesign"
        ]
    },
    jarron: {
        descripcion: "Jarrón decorativo de terracota. Con su acabado natural y textura única, este jarrón aporta un toque rústico y sofisticado a cualquier rincón.",
        detalles: [
            "Material: Terracota artesanal",
            "Estilo: Rústico Moderno",
            "Color: Tonos tierra naturales",
            "Uso: Decorativo interior",
            "Marca: RusticHome"
        ]
    },
    jarrones: {
        descripcion: "Set de jarrones decorativos en diferentes tamaños coordinados. Perfectos para crear atractivas composiciones visuales en estanterías o centros de mesa.",
        detalles: [
            "Contenido: Set de 3 piezas",
            "Material: Cerámica esmaltada",
            "Estilo: Contemporáneo versátil",
            "Características: Tamaños escalonados, acabado liso",
            "Marca: DecorHome"
        ]
    },
    tulipanes: {
        descripcion: "Arreglo decorativo de tulipanes artificiales de tacto real. Disfruta de la belleza y delicadeza de los tulipanes durante todo el año sin necesidad de cuidados.",
        detalles: [
            "Tipo: Flores artificiales de tacto real",
            "Cantidad: Ramo de 10 unidades",
            "Material: Polímero suave de alta calidad",
            "Ventajas: Belleza duradera, fácil limpieza",
            "Marca: NatureFake"
        ]
    },

    // ─── ROPA / PANTALONES PARA HOMBRES ─────────────────────────────────────────
    pantalon_negro: {
        descripcion: "El Pantalón Negro combina elegancia y comodidad. Su diseño moderno y su tela de alta calidad lo hacen ideal para ocasiones formales y el uso diario.",
        detalles: [
            "Diseño elegante y moderno",
            "Tela suave y duradera",
            "Corte ajustado y cómodo",
            "Ideal para eventos y oficina",
            "Disponible en varias tallas"
        ]
    },
    pantalones_de_golf: {
        descripcion: "Los Pantalones de Golf están diseñados para ofrecerte el máximo rendimiento y comodidad en el campo. Su tela transpirable y flexible permite una total libertad de movimiento.",
        detalles: [
            "Tela transpirable y ligera",
            "Flexibilidad para mayor movimiento",
            "Diseño moderno y deportivo",
            "Resistente a las arrugas",
            "Ideal para el campo de golf"
        ]
    },
    pantalones_deportivos_joggers: {
        descripcion: "Los Pantalones Deportivos Joggers combinan estilo urbano y comodidad deportiva. Perfectos para tus entrenamientos o para un look relajado en tu día a día.",
        detalles: [
            "Diseño jogger moderno",
            "Material suave y elástico",
            "Cintura ajustable con cordón",
            "Bolsillos prácticos",
            "Ideal para deporte o casual"
        ]
    },
    pantalones_jeans: {
        descripcion: "Los Pantalones Jeans son un clásico que nunca pasa de moda. Con su diseño resistente y versátil, son la prenda ideal para cualquier ocasión informal.",
        detalles: [
            "Diseño clásico de mezclilla",
            "Tela resistente y duradera",
            "Ajuste cómodo y versátil",
            "Fácil de combinar",
            "Disponible en varios lavados"
        ]
    },
    pantalones_joggers: {
        descripcion: "Los Pantalones Joggers ofrecen la mezcla perfecta entre comodidad y estilo. Con su ajuste relajado y su tela suave, son ideales para descansar o para un look casual.",
        detalles: [
            "Ajuste relajado y cómodo",
            "Tela suave al tacto",
            "Puños elásticos en los tobillos",
            "Ideal para el uso diario",
            "Disponible en varios colores"
        ]
    },

    // ─── ROPA / PANTALONES PARA MUJERES ─────────────────────────────────────────
    leggings_de_licra: {
        descripcion: "Los Leggings de Licra son flexibles, cómodos y perfectos para ejercicio, yoga o uso diario. Su tela suave permite libertad total de movimiento.",
        detalles: [
            "Tela de licra ultra flexible",
            "Diseño cómodo y ajustado",
            "Suaves y ligeros",
            "Perfectos para deporte o uso diario",
            "Disponibles en varias tallas"
        ]
    },
    pantalon_acampanado: {
        descripcion: "El Pantalón Acampanado combina estilo y comodidad. Su diseño moderno y su caída elegante lo hacen ideal para ocasiones casuales o formales.",
        detalles: [
            "Diseño acampanado moderno",
            "Tela suave y cómoda",
            "Ajuste perfecto a la cintura",
            "Ideal para uso diario o eventos",
            "Disponible en varias tallas"
        ]
    },
    pantalon_casual: {
        descripcion: "El Pantalón Casual está diseñado para acompañarte en tu día a día. Su estilo moderno y su comodidad lo convierten en una prenda esencial para cualquier guardarropa.",
        detalles: [
            "Diseño casual y moderno",
            "Tela suave y ligera",
            "Ajuste cómodo en la cintura",
            "Ideal para uso diario",
            "Disponible en varias tallas"
        ]
    },
    pantalon_jean: {
        descripcion: "El Pantalón Jean ofrece durabilidad, estilo y comodidad. Perfecto para combinar con cualquier outfit y usar en cualquier ocasión.",
        detalles: [
            "Diseño clásico y moderno",
            "Tela resistente y de alta calidad",
            "Ajuste cómodo y flexible",
            "Ideal para uso diario",
            "Disponible en varias tallas"
        ]
    },
    pantalon_liso_mujer: {
        descripcion: "El Pantalón Liso para Mujer combina elegancia y comodidad, ideal para el uso diario o para ocasiones semi-formales. Su diseño minimalista permite combinarlo fácilmente con diferentes estilos.",
        detalles: [
            "Diseño liso y elegante",
            "Material suave y cómodo",
            "Ideal para combinar con blusas o camisetas",
            "Perfecto para uso casual o de oficina",
            "Disponible en varias tallas y colores"
        ]
    },

    // ─── ROPA / PANTALONES PARA NIÑOS ───────────────────────────────────────────
    jean_para_ninos: {
        descripcion: "El Jean para Niños combina el estilo clásico de la mezclilla con la resistencia necesaria para el juego. Un pantalón que dura y se ve bien.",
        detalles: [
            "Mezclilla reforzada en puntos clave",
            "Cintura ajustable interna",
            "Estilo clásico de 5 bolsillos",
            "Efecto de lavado moderno",
            "Alta durabilidad"
        ]
    },
    licra_para_ninos: {
        descripcion: "La Licra para Niños ofrece total libertad de movimiento para los más pequeños. Ideal para actividades deportivas o juegos activos con máxima comodidad.",
        detalles: [
            "Material ultra elástico",
            "Costuras planas anti-rozaduras",
            "Secado rápido",
            "Protección contra el desgaste",
            "Ideal para deportes infantiles"
        ]
    },
    pantalon_deportivo: {
        descripcion: "El Pantalón Deportivo para niños es perfecto para la educación física y el juego diario. Su material resistente aguanta el ritmo de los niños más activos.",
        detalles: [
            "Tela resistente y duradera",
            "Cintura elástica con cordón",
            "Bolsillos de seguridad",
            "Fácil de lavar y secar",
            "Diseño dinámico y cómodo"
        ]
    },
    pantalon_liso: {
        descripcion: "El Pantalón Liso para niños es una prenda básica y versátil. Su diseño sencillo permite combinarlo fácilmente para cualquier ocasión cotidiana.",
        detalles: [
            "Color sólido y elegante",
            "Tela suave para piel sensible",
            "Ajuste cómodo para el juego",
            "Resistencia a las manchas",
            "Básico indispensable"
        ]
    },
    pantalones_lisos_para_ninos: {
        descripcion: "Los Pantalones Lisos para Niños ofrecen comodidad y durabilidad para el día a día. Diseñados pensando en el movimiento constante de los niños.",
        detalles: [
            "Color sólido y elegante",
            "Tela suave para piel sensible",
            "Ajuste cómodo para el juego",
            "Resistencia a las manchas",
            "Básico indispensable"
        ]
    },

    // ─── ROPA / TRAJES PARA HOMBRES ─────────────────────────────────────────────
    traje_2_piezas: {
        descripcion: "El Traje 2 Piezas combina elegancia y comodidad. Incluye chaqueta y pantalón confeccionados con materiales de alta calidad, perfectos para eventos formales y ocasiones especiales.",
        detalles: [
            "Corte Slim Fit moderno",
            "Tela suave y de alta calidad",
            "Forro interior sedoso",
            "Perfecto para oficina o eventos",
            "Incluye saco y pantalón combinados"
        ]
    },
    traje_azul: {
        descripcion: "El Traje Azul combina elegancia y comodidad. Incluye chaqueta y pantalón confeccionados con materiales de alta calidad, perfectos para eventos formales y ocasiones especiales.",
        detalles: [
            "Corte Slim Fit moderno",
            "Tela suave y de alta calidad",
            "Forro interior sedoso",
            "Perfecto para oficina o eventos",
            "Tono azul profundo sofisticado"
        ]
    },
    traje_completo: {
        descripcion: "El Traje Completo combina elegancia y comodidad. Incluye saco, pantalón y chaleco confeccionados con materiales de alta calidad, ideales para eventos de gala.",
        detalles: [
            "Incluye saco, pantalón y chaleco",
            "Diseño clásico y atemporal",
            "Ideal para bodas y galas",
            "Tela de alta durabilidad",
            "Ajuste preciso"
        ]
    },
    traje_elegante: {
        descripcion: "El Traje Elegante destaca por su acabado premium. Ideal para quienes buscan distinción y exclusividad en cada detalle para sus momentos más importantes.",
        detalles: [
            "Diseño premium para ocasiones especiales",
            "Tela con acabado sutil y sofisticado",
            "Ajuste perfecto a la medida",
            "Materiales importados de alta calidad",
            "Máxima elegancia"
        ]
    },
    traje_negro: {
        descripcion: "El Traje Negro es la definición de la sobriedad y el estilo. Una pieza indispensable para eventos nocturnos y rigurosa etiqueta formal.",
        detalles: [
            "De color negro sólido y elegante",
            "Tela resistente a las arrugas",
            "Ideal para cualquier evento formal",
            "Corte clásico que nunca pasa de moda",
            "Acabado impecable"
        ]
    },

    // ─── ROPA / VESTIDOS ───────────────────────────────────────────────────────
    vestido_ajustado: {
        descripcion: "El Vestido Ajustado realza la figura con sofisticación. Su diseño moderno y material elástico aseguran un ajuste impecable para noches inolvidables.",
        detalles: [
            "Corte ajustado que realza la silueta",
            "Material elástico y cómodo",
            "Ideal para cenas y eventos nocturnos",
            "Diseño vanguardista",
            "Tela de alta calidad"
        ]
    },
    vestido_cuello_cuadrado: {
        descripcion: "El Vestido de Cuello Cuadrado combina una estética clásica con un toque moderno. Su diseño favorecedor es ideal para eventos sociales y salidas especiales.",
        detalles: [
            "Elegante diseño de cuello cuadrado",
            "Material suave y con caída",
            "Corte femenino y fluido",
            "Ideal para fiestas de día o noche",
            "Acabado delicado"
        ]
    },
    vestido_de_invierno: {
        descripcion: "El Vestido de Invierno está diseñado para ofrecer calidez sin sacrificar la elegancia. Perfecto para mantener el estilo durante las temporadas más frías.",
        detalles: [
            "Tejido térmico ligero",
            "Diseño sofisticado para frío",
            "Corte cómodo y protector",
            "Ideal para eventos invernales",
            "Material de alta densidad"
        ]
    },
    vestido_elegante: {
        descripcion: "El Vestido Elegante es la máxima expresión de estilo. Confeccionado con atención al detalle, es la prenda perfecta para brillar en galas y recepciones.",
        detalles: [
            "Diseño de alta costura",
            "Telas exclusivas y delicadas",
            "Corte que garantiza distinción",
            "Detalles artesanales",
            "Alta gama"
        ]
    },
    vestido_negro: {
        descripcion: "El Clásico Vestido Negro es versátil y atemporal. Un 'must-have' que ofrece elegancia instantánea tanto para eventos de cóctel como para cenas formales.",
        detalles: [
            "Estilo negro clásico y versátil",
            "Tela fresca con cuerpo",
            "Diseño minimalista y moderno",
            "Indispensable en todo guardarropa",
            "Fácil de accesorizar"
        ],
    },
};
