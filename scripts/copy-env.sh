#!/usr/bin/env bash

echo -e "\033[34mCopy test env files to the services folders...\n\033[0m";

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.

cp -rf $PWD/services/admin-api/.env.sample $PWD/services/admin-api/.env.test
cp -rf $PWD/services/admin-ui/.env.sample $PWD/services/admin-ui/.env.test
cp -rf $PWD/services/mobile-api/.env.sample $PWD/services/mobile-api/.env.test
cp -rf $PWD/services/market-api/.env.sample $PWD/services/market-api/.env.test
cp -rf $PWD/services/market-ui/.env.sample $PWD/services/market-ui/.env.test
cp -rf $PWD/services/core-eth/.env.sample $PWD/services/core-eth/.env.test
cp -rf $PWD/microservices/eml/.env.sample $PWD/microservices/eml/.env.test
cp -rf $PWD/microservices/game/.env.sample $PWD/microservices/game/.env.test
cp -rf $PWD/microservices/json/.env.sample $PWD/microservices/json/.env.test

sed -i -e "s/PRIVATE_KEY=.*/PRIVATE_KEY=$PRIVATE_KEY/g" $PWD/contracts/core/.env
sed -i -e "s/RINKEBY_RPC_URL=.*/RINKEBY_RPC_URL=$RINKEBY_RPC_URL/g" $PWD/contracts/core/.env
sed -i -e "s/GOERLI_RPC_URL=.*/GOERLI_RPC_URL=$GOERLI_RPC_URL/g" $PWD/contracts/core/.env

echo -e "\033[34mAll done!\n\033[0m";


