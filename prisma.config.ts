// Prisma 7+ configuration file
// Connection URL moved from schema.prisma to here
// See: https://pris.ly/d/config-datasource

export default {
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
}

