import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/WareHouseVizualization/',
  plugins: [react()],
server: {
  proxy: {
    '/api': {
      target: 'https://dvakrat.bezsody.cz/api/', // backend URL
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ''), // odstraní /api při přeposlání
    },
  },
},
});

