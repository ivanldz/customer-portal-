FROM node:18-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml .env.prod /templates ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy
ENV  NODE_ENV=prod

WORKDIR /app
COPY --from=build /app/dist/  ./dist/
COPY --from=build /app/.env.prod  .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/templates ./templates

CMD [ "node", "--max-old-space-size=200", "dist/main.js" ]