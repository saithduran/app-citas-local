import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx', // Punto de entrada de React
            refresh: true,
        }),
        react(), // Plugin de React
    ],
    build: {
        outDir: 'public/build', // Carpeta de salida para los assets compilados
        emptyOutDir: true, // Limpia la carpeta de salida antes de construir
    },
    base: '/build/', // Ruta base para los assets en producción
});
