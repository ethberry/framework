FROM node:16-alpine

RUN apk add \
  python \
  build-base \
  git \
  bash \
  gettext \
  && npm i -g node-gyp

USER node

RUN mkdir -p /home/node/framework
WORKDIR /home/node/framework

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .

RUN npm i --only=production

COPY --chown=node:node . .

RUN ls -la

RUN npm run bootstrap

