# NFT Framework

Welcome to Framework monorepo.

## Prepare
Prepare /etc/hosts file,
Add lines:
```shell script
127.0.0.1       admin.fw.com
127.0.0.1       admin-api.fw.com
127.0.0.1       market.fw.com
127.0.0.1       json-api.fw.com
127.0.0.1       market-api.fw.com
```
## Docker-compose

```shell script
docker compose -f docker-compose-dev.yml build
docker compose -f docker-compose-dev.yml up -d postgres redis rabbitmq besu explorer
docker compose -f docker-compose-dev.yml up -d
```