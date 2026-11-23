# Multi-stage production build for NestJS Backend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
