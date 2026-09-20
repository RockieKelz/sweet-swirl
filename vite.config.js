import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
})
