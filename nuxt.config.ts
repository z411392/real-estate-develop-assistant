const onDevelopment = process.env.NODE_ENV === "development"

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      timezone: process.env.TZ!,
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY!,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
        databaseURL: process.env.FIREBASE_DATABASE_URL!,
        projectId: process.env.FIREBASE_PROJECT_ID!,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
        appId: process.env.FIREBASE_APP_ID!,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
      },
      apiBaseURL: process.env.API_BASE_URL!,
    }
  },
  webpack: { optimizeCSS: true },
  build: {
    transpile: ['vuetify'],
  },
  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/public/css/main.css',
  ],
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': require('postcss-nesting'),
      tailwindcss: {},
      autoprefixer: {},
    }
  },
  app: {
    head: {
      title: '地政小幫手',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        onDevelopment ? {} : { "http-equiv": "Content-Security-Policy", content: "upgrade-insecure-requests" },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.ico',
        },
      ],
    },
  },
})
