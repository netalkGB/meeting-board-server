export default {
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/eslint-module'],
  eslint: {
    fix: true,
    extensions: ['js', 'ts', 'vue']

  },
  ssr: true,
  serverMiddleware: [
    { path: '/api/screenshot', handler: '~/api/screenshot.js' },
    { path: '/api/calendar', handler: '~/api/calendar.js' }
  ],
  axios: {
    baseURL: 'http://localhost:3000/'
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module'
  ]
}
