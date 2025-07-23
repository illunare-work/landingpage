import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'illunare 4.0 — IA multimodal com precisão de nível quântico',
    short_name: 'illunare',
    description: 'Revolucione seu negócio com nossa plataforma de IA multimodal avançada. Inovação 4.0 eficiente, rentável e nacional.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f23',
    theme_color: '#0061F2',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['business', 'productivity', 'technology'],
    lang: 'pt-BR',
  }
} 