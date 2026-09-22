import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub 저장소 이름인 my-study-archive를 base 경로로 설정
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/my-study-archive/',
})
