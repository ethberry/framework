#!/usr/bin/env bash


echo -e "\033[34mTesting...\n\033[0m";

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.

export NODE_ENV=$NODE_ENV
export POSTGRES_URL=$POSTGRES_URL
export CHAIN_ID=$CHAIN_ID
export PRIVATE_KEY=$PRIVATE_KEY
export RINKEBY_RPC_URL=$RINKEBY_RPC_URL
export JSON_RPC_ADDR_GOERLY=$JSON_RPC_ADDR_GOERLY

lerna bootstrap --concurrency 1 --hoist --ignore-scripts
lerna run build --stream

lerna exec --scope @framework/core-contracts -- npm run test
lerna exec --scope @framework/admin-api -- npm run test
lerna exec --scope @framework/traits -- npm run test
lerna exec --scope @framework/market-api -- npm run test
lerna exec --scope @framework/mobile-api -- npm run test
