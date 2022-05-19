# NFT Framework

Welcome to Framework monorepo.

## Pre Install

I assume you have NodeJS NPM/YARN, Postgres, RabbitMQ and Redis installed
or, you can just use docker and docker compose :)

In case you have installed postgres db, you must create `gemunion-development` database manually,
script only creates schema for you.

In order to run tests, you must create `gemunion-test` database manually too.

In any case you have to fill up sensitive keys in docker files or .env files

## DEV setup with Docker-compose and Besu blockchain
0. Stop all containers (if any) and clean existing postgres and besu
```shell script
docker stop $(docker ps -a -q)
docker compose down -v
rm -rf postgres
rm -rf besu
```
1. Run prepare script
```shell script
npm run prepare:framework:dev
```
2. Run framework services one-by-one in separate terminals for easy monitoring

Admin-api (it will run initpostgres migrations)
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
Binance-Rpc
```shell script
npm run --prefix ./services/binance-rpc start
```

## Production set-up in docker environment
fill up config
```shell script
nano docker-compose.yml
```
stop all containers (if any)
```shell script
docker stop $(docker ps -a -q)
```
build and run
```shell script
docker-compose -f docker-compose.dependencies.yml build
docker-compose up --build
```

## Manual Installation

There is installation script which will install all dependencies, build and run all services for you

```bash
bash scripts/install.sh
```

Then you can run project

```bash
npm run start
```

## API docs

There is Swagger API documentation configured on http://localhost:3001/swagger

## Configuration

For fine tune check services READMEs

