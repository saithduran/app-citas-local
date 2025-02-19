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
    server: {
        host: 'localhost',
        port: 5173, // Puerto en el que se ejecuta Vite
        strictPort: true, // Asegura que Vite no cambie el puerto
    },
});