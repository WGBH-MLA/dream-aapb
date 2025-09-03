FROM node:alpine as base

# Development
FROM base AS dev
ENV PATH="${PATH}:/app/node_modules/.bin"
WORKDIR /app

COPY package*.json .
RUN npm i

CMD npm run dev

## Build
FROM dev as builder
WORKDIR /app

COPY . .
RUN npm run build

## Production dependencies
FROM dev AS prod-deps
WORKDIR /app

RUN npm i --omit=dev

## Production
FROM base as production
ENV NODE_ENV=production
ENV PATH="${PATH}:/app/node_modules/.bin"
WORKDIR /app 

RUN addgroup --system --gid 1001 remix
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=prod-deps --chown=remix:remix /app/package*.json ./
COPY --from=prod-deps --chown=remix:remix /app/node_modules ./node_modules
COPY --from=builder --chown=remix:remix /app/build ./build
COPY --from=builder --chown=remix:remix /app/public ./public

CMD [ "npm", "run", "start" ]
