FROM node:14-alpine

RUN apk add \
  python \
  build-base \
  git \
  bash \
  gettext \
  && npm i -g node-gyp

USER node

RUN mkdir -p /home/node/solo
WORKDIR /home/node/solo

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .

RUN npm i --only=production

COPY --chown=node:node . .

RUN ls -la

RUN npm run bootstrap

