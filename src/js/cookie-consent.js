document.addEventListener('DOMContentLoaded', function () {
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptButton = document.getElementById('accept-cookies');
    const rejectButton = document.getElementById('reject-cookies');

    // Verificar si el usuario ya ha dado su consentimiento
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        cookieConsent.classList.remove('hidden');
    } else if (consent === 'accepted') {
        loadAnalyticsScripts();
    }

    // Función para cargar scripts de terceros
    function loadAnalyticsScripts() {
        const scripts = document.querySelectorAll('script[data-cookiecategory="analytics"]');
        scripts.forEach(script => {
            if (script.src) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.async = script.async;
                newScript.defer = script.defer;
                document.body.appendChild(newScript);
            } else {
                eval(script.textContent);
            }
        });
    }

    // Manejar clic en "Aceptar"
    acceptButton.addEventListener('click', function () {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.classList.add('hidden');
        loadAnalyticsScripts();
    });

    // Manejar clic en "Rechazar"
    rejectButton.addEventListener('click', function () {
        localStorage.setItem('cookieConsent', 'rejected');
        cookieConsent.classList.add('hidden');
    });
});