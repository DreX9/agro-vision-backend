FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias del sistema para compilar Prisma
RUN apt-get update -y && apt-get install -y openssl

# Instalar pnpm v9 para total compatibilidad con el lockfile del proyecto
RUN npm install -g pnpm@9

# Copiar dependencias y schema de Prisma
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY prisma ./prisma/

# Instalar dependencias y generar cliente Prisma
RUN pnpm install --frozen-lockfile
RUN npx prisma generate

# Copiar código fuente y compilar NestJS
COPY . .
RUN npx nest build

# --- Imagen final de Producción ---
FROM node:20-slim AS runner

WORKDIR /app

# OpenSSL para Prisma en Linux
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copiar archivos base
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Reutilizar los módulos y artefactos compilados desde builder (sin necesidad de reinstalar)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Ejecutar migraciones en Neon, sembrar datos iniciales y arrancar NestJS
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main.js"]
