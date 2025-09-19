FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Production image: serve dist with a minimal server
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json ./
RUN npm install --omit=dev

EXPOSE 4040
CMD ["npx", "serve", "-s", "dist", "-l", "4040"]