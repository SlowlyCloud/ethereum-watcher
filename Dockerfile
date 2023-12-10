FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install --ignore-engines && yarn build

FROM node:18-alpine 

ARG NODE_ENV

ENV NODE_ENV=${NODE_ENV:-production}

WORKDIR /app

COPY --from=builder --link /app/dist .
COPY --from=builder --link /app/node_modules ./node_modules/
COPY --from=builder --link /app/.env ./.env/

RUN yarn global add pm2 

EXPOSE 3000

CMD ["pm2-runtime", "./main.js"]
