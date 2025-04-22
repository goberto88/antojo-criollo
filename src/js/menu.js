document.addEventListener('DOMContentLoaded', () => {
    // Definir las imágenes para cada carrusel (categoría)
    const carouselImages = {
        'carousel-1': [
            { src: '/img/torta.png', alt: 'Tortas y Tartas 1' },
            { src: '/img/torta1.png', alt: 'Tortas y Tartas 2' },
            { src: '/img/torta2.png', alt: 'Tortas y Tartas 3' },
            { src: '/img/torta3.png', alt: 'Tortas y Tartas 4' },
            { src: '/img/torta4.png', alt: 'Tortas y Tartas 5' },
        ],
        'carousel-2': [
            { src: '/img/horneados.png', alt: 'Horneados 1' },
            { src: '/img/horneados1.png', alt: 'Horneados 2' },
            { src: '/img/horneados2.png', alt: 'Horneados 3' },
            { src: '/img/horneados3.png', alt: 'Horneados 4' },
            { src: '/img/horneados4.png', alt: 'Horneados 5' },
            { src: '/img/horneados5.png', alt: 'Horneados 6' },
            { src: '/img/horneados6.png', alt: 'Horneados 7' },
            { src: '/img/horneados7.png', alt: 'Horneados 8' },
            { src: '/img/horneados8.png', alt: 'Horneados 9' },
        ],
        'carousel-3': [
            { src: '/img/fritos.png', alt: 'Pasapalos Fritos 1' },
            { src: '/img/fritos1.png', alt: 'Pasapalos Fritos 2' },
            { src: '/img/fritos2.png', alt: 'Pasapalos Fritos 3' },
            { src: '/img/fritos3.png', alt: 'Pasapalos Fritos 4' },
        ],
        'carousel-4': [
            { src: '/img/congelados.png', alt: 'Congelados 1' },
            { src: '/img/congelados1.png', alt: 'Congelados 2' },
            { src: '/img/congelados2.png', alt: 'Congelados 3' },
            { src: '/img/congelados3.png', alt: 'Congelados 4' },
            { src: '/img/congelados4.png', alt: 'Congelados 5' },
        ]
    };

    // Seleccionar todos los carruseles
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        // Obtener el ID del carrusel para identificar qué imágenes cargar
        const carouselId = carousel.id;
        const images = carouselImages[carouselId] || [];

        // Si no hay imágenes para este carrusel, salir
        if (images.length === 0) {
            console.warn(`No se encontraron imágenes para el carrusel con ID: ${carouselId}`);
            return;
        }

        // Crear un array extendido: [última imagen, ...imágenes originales, primera imagen]
        const extendedImages = [
            images[images.length - 1], // Última imagen al inicio
            ...images,                 // Imágenes originales
            images[0]                 // Primera imagen al final
        ];

        // Añadir las imágenes extendidas al carrusel
        extendedImages.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = image.alt;
            imgElement.className = 'w-full h-full object-cover flex-shrink-0';
            carousel.appendChild(imgElement);
        });

        // Lógica del movimiento automático
        let currentIndex = 1; // Comenzar en la primera imagen real
        const totalImages = images.length; // Número de imágenes originales
        const totalExtendedImages = extendedImages.length; // Número total de imágenes (originales + clonadas)

        const moveCarousel = () => {
            currentIndex++;

            // Aplicar transición suave
            carousel.style.transition = 'transform 0.5s ease-in-out';
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Cuando llegamos a la última imagen clonada
            if (currentIndex === totalExtendedImages - 1) {
                setTimeout(() => {
                    // Desactivar la transición para el salto instantáneo
                    carousel.style.transition = 'none';
                    currentIndex = 1; // Volver a la primera imagen real
                    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                }, 500); // Esperar a que termine la transición (0.5s)
            }
            // Cuando llegamos a la primera imagen clonada
            else if (currentIndex === 0) {
                setTimeout(() => {
                    // Desactivar la transición para el salto instantáneo
                    carousel.style.transition = 'none';
                    currentIndex = totalImages; // Volver a la última imagen real
                    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                }, 500); // Esperar a que termine la transición (0.5s)
            }
        };

        // Mover el carrusel cada 3 segundos
        setInterval(moveCarousel, 3000);

        // Establecer la posición inicial
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
});