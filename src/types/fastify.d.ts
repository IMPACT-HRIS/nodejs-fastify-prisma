import 'fastify'

declare module 'fastify' {
  declare namespace FastifySessionPlugin {
    interface SessionStore {
      /**
       * Delete all sessions from the store.
       */
      clear(): void
    }
  }

  interface Session {
    admin?: {
      isLoggedIn: true
    }
    user?: any
  }
}
