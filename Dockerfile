FROM node:22.16.0 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:22.16.0 AS development

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
