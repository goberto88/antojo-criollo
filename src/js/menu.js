import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', async () => {
    // Definir las imágenes para cada carrusel
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
        ],
        'carousel-4': [
            { src: '/img/congelados.png', alt: 'Congelados 1' },
            { src: '/img/congelados1.png', alt: 'Congelados 2' },
            { src: '/img/congelados3.png', alt: 'Congelados 4' },
            { src: '/img/congelados4.png', alt: 'Congelados 5' },
            { src: '/img/congelados5.png', alt: 'Congelados 5' }
        ],
        'carousel-5': [
            { src: '/img/combos.png', alt: 'Combos 1' },
            { src: '/img/combos1.png', alt: 'Combos 2' },
            { src: '/img/combos2.png', alt: 'Combos 3' },
            { src: '/img/combos3.png', alt: 'Combos 4' },
            { src: '/img/combos4.png', alt: 'Combos 5' }
        ],
    };

    // Mapear categorías de Firestore a IDs de sección
    const categoryMap = {
        tortas: 'tortas-list',
        horneados: 'horneados-list',
        fritos: 'fritos-list',
        congelados: 'congelados-list',
    };

    // Obtener datos de la colección "Menu"
    try {
        const menuSnapshot = await getDocs(collection(db, 'Menu'));
        const menuItems = [];

        menuSnapshot.forEach((doc) => {
            const data = doc.data();

            if (data.categoria && data.producto && data.precio) {
                menuItems.push({ id: doc.id, ...data });
            } else {
                console.warn(`Documento con ID ${doc.id} tiene datos incompletos:`, data);
            }
        });

        // Renderizar elementos de las categorías de "Menu"
        Object.keys(categoryMap).forEach((category) => {
            const listElement = document.getElementById(categoryMap[category]);
            if (!listElement) {
                console.warn(`No se encontró la lista con ID: ${categoryMap[category]}`);
                return;
            }

            const items = menuItems.filter((item) => {
                if (!item.categoria) {
                    console.warn(`Elemento sin categoría:`, item);
                    return false;
                }
                const normalizedCategory = item.categoria.trim().toLowerCase();
                return normalizedCategory === category || normalizedCategory === category.slice(0, -1);
            });

            listElement.innerHTML = '';

            if (items.length === 0) {
                listElement.innerHTML = '<li class="text-center text-negro">No hay productos disponibles en esta categoría.</li>';
                return;
            }

            if (category === 'horneados') {
                // Separar horneados en subgrupos: no galleta y galleta
                const nonGalletaItems = items
                    .filter((item) => !item.subcategoria || item.subcategoria.trim().toLowerCase() !== 'galleta')
                    .sort((a, b) => (a.n || Infinity) - (b.n || Infinity)); // Ordenar por n
                const galletaItems = items
                    .filter((item) => item.subcategoria && item.subcategoria.trim().toLowerCase() === 'galleta')
                    .sort((a, b) => (a.n || Infinity) - (b.n || Infinity)); // Ordenar por n

                // Renderizar no galleta primero
                if (nonGalletaItems.length > 0) {
                    nonGalletaItems.forEach((item) => {
                        const li = document.createElement('li');
                        li.className = 'flex items-center gap-4';
                        li.innerHTML = `
                            <span class="break-words flex-1">${item.producto}</span>
                            <span class="text-titulo flex-shrink-0 font-semibold">${item.precio}</span>
                        `;
                        listElement.appendChild(li);
                    });
                }

                // Renderizar galleta al final
                if (galletaItems.length > 0) {
                    const galletaHeading = document.createElement('h3');
                    galletaHeading.className = 'text-base sm:text-lg md:text-xl font-semibold text-titulo mt-6 mb-4 text-star';
                    galletaHeading.textContent = 'Galletas NY (Peso aproximado 180 gr)';
                    listElement.appendChild(galletaHeading);

                    galletaItems.forEach((item) => {
                        const li = document.createElement('li');
                        li.className = 'flex items-center gap-4';
                        li.innerHTML = `
                            <span class="break-words flex-1">${item.producto}</span>
                            <span class="text-titulo flex-shrink-0 font-semibold">${item.precio}</span>
                        `;
                        listElement.appendChild(li);
                    });
                }
            } else {
                // Renderizar otras categorías
                items.sort((a, b) => (a.n || Infinity) - (b.n || Infinity)); // Ordenar por n
                items.forEach((item) => {
                    const li = document.createElement('li');
                    li.className = 'flex items-center gap-4';
                    li.innerHTML = `
                        <span class="break-words flex-1">${item.producto}</span>
                        <span class="text-titulo flex-shrink-0 font-semibold">${item.precio}</span>
                    `;
                    listElement.appendChild(li);
                });
            }
        });
    } catch (error) {
        console.error('Error al cargar el menú desde Firestore:', error);
    }

    // Obtener datos de la colección "Combos"
    try {
        const combosSnapshot = await getDocs(collection(db, 'Combos'));
        const combosListElement = document.getElementById('combos-list');
        if (!combosListElement) {
            console.warn('No se encontró la lista con ID: combos-list');
            return;
        }

        combosListElement.innerHTML = ''; // Limpiar contenido existente
        const combosItems = [];

        combosSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.titulo) {
                combosItems.push({ id: doc.id, ...data });
            } else {
                console.warn(`Documento con ID ${doc.id} no tiene título:`, data);
            }
        });

        if (combosItems.length === 0) {
            console.error('No se encontraron combos válidos en la colección Combos');
            combosListElement.innerHTML = '<li class="text-center text-negro">No hay combos disponibles. Por favor, verifica la colección Combos en Firebase.</li>';
            return;
        }

        // Ordenar combos por n
        combosItems.sort((a, b) => (a.n || Infinity) - (b.n || Infinity));

        combosItems.forEach((item) => {
            // Contenedor para el combo (título + lista + precio)
            const comboContainer = document.createElement('div');
            comboContainer.className = 'relative mb-6';

            // Título del combo
            const titleElement = document.createElement('h3');
            titleElement.className = 'text-base sm:text-lg md:text-xl font-semibold text-titulo mb-4 text-center';
            titleElement.textContent = item.titulo;
            comboContainer.appendChild(titleElement);

            // Lista de productos
            const ulElement = document.createElement('ul');
            ulElement.className = 'text-xs sm:text-sm md:text-base font-normal text-negro space-y-3 w-3/4';
            const products = [item.producto1, item.producto2, item.producto3, item.producto4].filter(Boolean);

            if (products.length === 0) {
                console.warn(`Combo ${item.titulo} no tiene productos válidos`);
                const li = document.createElement('li');
                li.className = 'text-negro';
                li.textContent = 'No hay productos disponibles para este combo';
                ulElement.appendChild(li);
            } else {
                products.forEach((product) => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="break-words">${product}</span>`;
                    ulElement.appendChild(li);
                });
            }

            comboContainer.appendChild(ulElement);

            // Mostrar precio si existe, centrado verticalmente a la derecha
            if (item.precio) {
                const priceElement = document.createElement('div');
                priceElement.className = 'absolute top-1/2 right-0 transform -translate-y-1/2 text-titulo flex-shrink-0 font-semibold text-xs sm:text-sm md:text-base';
                priceElement.textContent = item.precio;
                comboContainer.appendChild(priceElement);
            }

            combosListElement.appendChild(comboContainer);
        });
    } catch (error) {
        console.error('Error al cargar los combos desde Firestore:', error);
        const combosListElement = document.getElementById('combos-list');
        if (combosListElement) {
            combosListElement.innerHTML = '<li class="text-center text-negro">Error al cargar los combos. Por favor, verifica la conexión con Firebase.</li>';
        }
    }

    // Lógica del carrusel
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach((carousel) => {
        const carouselId = carousel.id;
        const images = carouselImages[carouselId] || [];

        if (images.length === 0) {
            console.warn(`No se encontraron imágenes para el carrusel con ID: ${carouselId}`);
            return;
        }

        const extendedImages = [images[images.length - 1], ...images, images[0]];

        extendedImages.forEach((image) => {
            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = image.alt;
            imgElement.className = 'w-full h-full object-cover flex-shrink-0';
            carousel.appendChild(imgElement);
        });

        let currentIndex = 1;
        const totalImages = images.length;
        const totalExtendedImages = extendedImages.length;

        const moveCarousel = () => {
            currentIndex++;
            carousel.style.transition = 'transform 0.5s ease-in-out';
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

            if (currentIndex === totalExtendedImages - 1) {
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    currentIndex = 1;
                    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                }, 500);
            } else if (currentIndex === 0) {
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    currentIndex = totalImages;
                    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                }, 500);
            }
        };

        setInterval(moveCarousel, 3000);
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
});