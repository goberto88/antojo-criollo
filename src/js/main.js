document.addEventListener('DOMContentLoaded', () => {
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
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contenido de los menús
    const menuContent = {
        tortas: `
            <ul class="list-disc list-inside  space-y-2 text-sm sm:text-base">
                <li>Torta Tres Leches</li>
                <li>Torta Quesillo</li>
                <li>Torta de Piña</li>
                <li>Pie de Limón</li>
                <li>Pie de Maracuyá</li>
                <li>Brownie</li>
                <li>Quesillo</li>
                <li>Torta de Chocolate Matilda</li>
            </ul>
        `,
        horneados: `
            <ul class="list-disc list-inside  space-y-2 text-sm sm:text-base">
                <li>Cachitos de Jamón y Bacón</li>
                <li>Pan de Guayaba</li>
                <li>Mini Golfeado</li>
                <li>Pan Dulce</li>
                <li>Mini Pan de Jamón</li>
                <li>Pan de Jamón</li>
            </ul>
        `,
        pasapalos: `
            <ul class="list-disc list-inside  space-y-2 text-sm sm:text-base">
                <li>Tequeño de Queso</li>
                <li>Tequeño de Guayaba y Queso</li>
                <li>Tequechapas</li>
                <li>Mini Tequeños de Quesos</li>
                <li>Mini Pastelitos de Carne Molida</li>
                <li>Mini Pastelitos de Pollo</li>
                <li>Mini Pastelitos de Jamón y Queso</li>
                <li>Mini Empanadas de Carne Molida</li>
                <li>Mini Empanadas de Pollo</li>
                <li>Mini Empanadas de Jamón y Queso</li>
            </ul>
        `,
        congelados: `
            <ul class="list-disc list-inside  space-y-2 text-sm sm:text-base">
                <li>Tequeño de Queso</li>
                <li>Tequeño de Guayaba y Queso</li>
                <li>Tequechapas</li>
                <li>Mini Tequeños de Quesos</li>
                <li>Mini Pastelitos de Carne Molida</li>
                <li>Mini Pastelitos de Pollo</li>
                <li>Mini Pastelitos de Jamón y Queso</li>
                <li>Mini Empanadas de Carne Molida</li>
                <li>Mini Empanadas de Pollo</li>
                <li>Mini Empanadas de Jamón y Queso</li>
                <li>Hallacas</li>
            </ul>
        `
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault(); // Evita el comportamiento predeterminado
          const targetId = this.getAttribute('href'); // Obtiene el ID del destino (#menu, #nosotros, etc.)
          const targetElement = document.querySelector(targetId); // Selecciona el elemento destino
          const headerHeight = document.querySelector('header').offsetHeight; // Obtiene la altura del header
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset; // Calcula la posición del elemento
      
          // Desplaza suavemente, compensando la altura del header
          window.scrollTo({
            top: targetPosition - headerHeight,
            behavior: 'smooth'
          });
        });
      });

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