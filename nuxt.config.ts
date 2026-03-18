export default defineNuxtConfig({
    compatibilityDate: '2025-01-01',

    extends: [
        './layers/domain/player',
        './layers/domain/session',
        './layers/technical/wheel',
        './layers/technical/ui',
    ],

    modules: [
        '@nuxt/ui',
        '@pinia/nuxt',
    ],

    css: ['~/assets/css/main.css'],

    ssr: false,

    app: {
        baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
        head: {
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap',
                },
            ],
        },
    },

    typescript: {
        strict: true,
    },
})
