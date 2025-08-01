# ---- build stage ----
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY postcss.config.mjs ./
COPY tailwind.config.mjs ./
COPY public ./public
COPY src ./src
RUN npm install --production=false
RUN npm run build

# ---- production stage ----
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production --ignore-scripts --prefer-offline
EXPOSE 3000
CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3000"]