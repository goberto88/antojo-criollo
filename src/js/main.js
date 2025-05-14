import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', async () => {
    // Menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && menuClose && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
        });

        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
        });

        // Cerrar menú al hacer clic en un enlace
        mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('translate-x-0');
                mobileMenu.classList.add('translate-x-full');
            });
        });
    } else {
        console.error('No se encontraron los elementos del menú hamburguesa.');
    }

    // Desplazamiento suave para enlaces de anclaje
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = targetId === '#top' ? document.body : document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cargar datos de Firestore para las categorías
    const categoryMap = {
        tortas: 'tortas',
        horneados: 'horneados',
        pasapalos: 'fritos',
        congelados: 'congelados',
        combos: 'combos'
    };

    let menuContent = {
        tortas: '<p class="text-center text-negro">Cargando productos...</p>',
        horneados: '<p class="text-center text-negro">Cargando productos...</p>',
        pasapalos: '<p class="text-center text-negro">Cargando productos...</p>',
        congelados: '<p class="text-center text-negro">Cargando productos...</p>',
        combos: '<p class="text-center text-negro">Cargando combos...</p>'
    };

    try {
        const menuSnapshot = await getDocs(collection(db, 'Menu'));
        const menuItems = [];


        menuSnapshot.forEach((doc) => {
            const data = doc.data();

            if (data.categoria && data.producto) {
                menuItems.push({ id: doc.id, ...data });
            } 
        });

        // Generar contenido para cada categoría
        Object.keys(categoryMap).forEach((menuType) => {
            if (menuType === 'combos') return; // Combos se manejan por separado

            const category = categoryMap[menuType];
            const items = menuItems.filter((item) => {
                if (!item.categoria) {
                    console.warn(`Elemento sin categoría:`, item);
                    return false;
                }
                const normalizedCategory = item.categoria.trim().toLowerCase();
                return normalizedCategory === category || normalizedCategory === category.slice(0, -1);
            });

            if (items.length === 0) {
                menuContent[menuType] = '<p class="text-center text-negro">No hay productos disponibles en esta categoría.</p>';
                return;
            }

            if (menuType === 'horneados') {
                // Separar horneados en no galleta y galleta
                const nonGalletaItems = items
                    .filter((item) => !item.subcategoria || item.subcategoria.trim().toLowerCase() !== 'galleta')
                    .sort((a, b) => a.producto.localeCompare(b.producto));
                const galletaItems = items
                    .filter((item) => item.subcategoria && item.subcategoria.trim().toLowerCase() === 'galleta')
                    .sort((a, b) => a.producto.localeCompare(b.producto));

                let html = '<ul class="list-disc list-inside space-y-2 text-sm sm:text-base">';
                if (nonGalletaItems.length > 0) {
                    nonGalletaItems.forEach((item) => {
                        html += `<li>${item.producto}</li>`;
                    });
                }

                if (galletaItems.length > 0) {
                    html += '</ul><h3 class="text-base font-semibold text-titulo mt-4 mb-2">Galletas NY (Peso aproximado 180 gr)</h3>';
                    html += '<ul class="list-disc list-inside space-y-2 text-sm sm:text-base">';
                    galletaItems.forEach((item) => {
                        html += `<li>${item.producto}</li>`;
                    });
                }
                html += '</ul>';
                menuContent[menuType] = html;
            } else {
                // Otras categorías
                items.sort((a, b) => a.producto.localeCompare(b.producto));
                let html = '<ul class="list-disc list-inside space-y-2 text-sm sm:text-base">';
                items.forEach((item) => {
                    html += `<li>${item.producto}</li>`;
                });
                html += '</ul>';
                menuContent[menuType] = html;
            }
        });

        // Cargar combos desde la colección "Combos"
        const combosSnapshot = await getDocs(collection(db, 'Combos'));
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
            menuContent.combos = '<p class="text-center text-negro">No hay combos disponibles.</p>';
        } else {
            combosItems.sort((a, b) => {
                const numA = parseInt(a.titulo.match(/\d+/)[0], 10);
                const numB = parseInt(b.titulo.match(/\d+/)[0], 10);
                return numA - numB;
            });

            let html = '';
            combosItems.forEach((item) => {
                html += `<h3 class="text-base font-semibold text-titulo mt-4 mb-2">${item.titulo}</h3>`;
                html += '<ul class="list-disc list-inside space-y-2 text-sm sm:text-base">';
                const products = [item.producto1, item.producto2, item.producto3, item.producto4].filter(Boolean);
                if (products.length === 0) {
                    html += '<li>No hay productos disponibles para este combo</li>';
                } else {
                    products.forEach((product) => {
                        html += `<li>${product}</li>`;
                    });
                }
                html += '</ul>';
            });
            menuContent.combos = html;
        }
    } catch (error) {
        console.error('Error al cargar datos desde Firestore:', error);
        Object.keys(menuContent).forEach((menuType) => {
            menuContent[menuType] = '<p class="text-center text-negro">Error al cargar los productos. Por favor, intenta de nuevo.</p>';
        });
    }

    // Tarjetas del menú
    const cards = document.querySelectorAll('[data-menu]');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const menuType = card.getAttribute('data-menu');
            const menuTitle = card.querySelector('h3').textContent;

            // Mostrar modal con SweetAlert2
            Swal.fire({
                title: menuTitle,
                html: menuContent[menuType],
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title',
                    htmlContainer: 'swal2-html-container',
                    confirmButton: 'swal2-confirm'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
        });
    });
});