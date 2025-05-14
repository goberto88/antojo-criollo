import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  root: 'src', // Define la carpeta raíz como "src"
  build: {
    outDir: '../dist', // Carpeta de salida para los archivos construidos
    rollupOptions: {
      input: {
        main: '/index.html', // Página principal
        menu: '/menu.html',  // Página secundaria
        politicaCookies: '/politica-cookies.html'
      }
    }
  },
  publicDir: '../public', // Carpeta para recursos estáticos (imágenes, etc.)
  // Optimización para Firebase
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore']
  }
});