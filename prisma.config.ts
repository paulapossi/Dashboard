// prisma.config.ts
export default {
  // Hier sagen wir Prisma, wo die DB für Migrationen/Push liegt
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
}