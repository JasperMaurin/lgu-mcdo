import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command, mode }) => {
    const isSpa = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || mode === 'spa';

    if (isSpa) {
        return {
            plugins: [
                react(),
                tailwindcss(),
            ],
            build: {
                outDir: 'dist',
                emptyOutDir: true,
            },
        };
    }

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.jsx'],
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
    };
});