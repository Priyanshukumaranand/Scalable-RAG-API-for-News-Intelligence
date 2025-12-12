# Multi-stage build for API
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
COPY .eslintrc.cjs ./.eslintrc.cjs
COPY .prettierrc ./.prettierrc
COPY jest.config.cjs ./jest.config.cjs
RUN npm run build
RUN mkdir -p dist/data && cp -r src/data/* dist/data/

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
