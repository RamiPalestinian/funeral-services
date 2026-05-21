FROM public.ecr.aws/docker/library/node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && test -f dist/main.js

FROM public.ecr.aws/docker/library/node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
RUN test -f dist/main.js
COPY --from=builder /app/src/database ./src/database
COPY sequelize.config.js .sequelizerc ./
COPY knowledge-base ./knowledge-base
COPY docker-entrypoint.sh ./

RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]