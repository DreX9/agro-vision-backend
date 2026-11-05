FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias del sistema para compilar Prisma
RUN apt-get update -y && apt-get install -y openssl

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar dependencias y schema de Prisma
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar todas las dependencias y generar cliente Prisma
RUN pnpm install --prod=false
RUN pnpm prisma:generate

# Copiar código fuente y compilar NestJS
COPY . .
RUN pnpm build

# --- Imagen final de Producción ---
FROM node:20-slim AS runner

WORKDIR /app

# OpenSSL para Prisma en Linux
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

# Copiar package.json y dependencias necesarias
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependencias necesarias para runtime y migraciones
RUN pnpm install --prod=false

# Copiar el código compilado y el cliente generado desde la etapa builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Ejecutar migraciones en Neon, sembrar datos iniciales y arrancar NestJS
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && pnpm start:prod"]

