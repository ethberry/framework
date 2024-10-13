# Token Management System

Welcome to Gemunion Framework monorepo.

## Installation

All commands are given for mac, please figure windows equivalents yourself

1. Clone repo from git

```shell script
git clone git@github.com:Gemunion/framework.git
git submodule update --init --recursive
```

2. Install [NVM](https://github.com/nvm-sh/nvm)

```shell script
sudo port install nvm

sudo echo "export NODE_OPTIONS=\"--max-old-space-size=16384\"" >>  /opt/local/share/nvm/init-nvm.sh
```

3. Install Node.js using NVM

```shell script
nvm install 22
nvm use 22
nvm alias default 22
```

4. Install Postgres, RabbitMQ, Redis using docker

```shell script
docker compose up -d
```

Then connect to Postgres and manually create `gemunion-development` database

5. Fill up sensitive keys in .env files

6. Obtain ethberry-development-firebase.json

## DEV setup with Docker-compose and Besu blockchain

1. Run prepare script

```shell script
npm run prepare:framework:dev
```

2. Run framework services one-by-one in separate terminals for easy monitoring

Admin-api (it will run postgres migrations)

```shell script
npm run --prefix ./services/admin-api start
```

Admin-ui

```shell script
npm run --prefix ./services/admin-ui start
```

Market-api

```shell script
npm run --prefix ./services/market-api start
```

Market-ui

```shell script
npm run --prefix ./services/market-ui start
```

Core-eth

```shell script
npm run --prefix ./services/core-eth start
```

3. In case everything went off-rails stop all containers (if any) and clean existing postgres and besu

```shell script
docker stop $(docker ps -a -q)
docker compose down -v
rm -rf postgres
rm -rf besu
```

## API docs

There is Swagger API documentation configured on

1. http://localhost:3001/swagger
2. http://localhost:3003/swagger
3. http://localhost:3005/swagger

## Configuration

For fine tune check services READMEs
