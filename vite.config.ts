import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [ react() ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: [ 'lucide-react' ],
    },

    server: {
      port: process.env.VITE_SERVER_PORT ? parseInt(process.env.VITE_SERVER_PORT) : 5173,

      // proxy: {
      //   '/api': {
      //     target: 'http://213.139.210.248:3000',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // },
    },
  };
});
