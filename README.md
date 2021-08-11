# solo

Welcome to Gem starter monorepo.


## Pre Install

I assume you have NodeJS NPM/YARN, Postgres, RabbitMQ and Redis installed
or you can just use docker :)

In case you have installed postgress, you must create `gem-development` database manually,
script only creates schema for you.

In order to run tests, you must create `gem-test` database manually too.

In any case you have to fill up sensitive keys in docker files or .env files

## Docker

copy and fill up config
```shell script
cp docker-compose.sample.yml docker-compose.yml
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

