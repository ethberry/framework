#!/usr/bin/env bash

echo -e "\033[34mCopy test env files to the services folders...\n\033[0m";

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.

#cp -rf $PWD/framework-contracts/contracts/core/.env.sample $PWD/framework-contracts/contracts/core/.env.test
cp -rf $PWD/services/admin-api/.env.sample $PWD/services/admin-api/.env.test
cp -rf $PWD/services/admin-ui/.env.sample $PWD/services/admin-ui/.env.test
cp -rf $PWD/services/admin-ui/.env.sample $PWD/services/admin-ui/.env.production
cp -rf $PWD/services/mobile-api/.env.sample $PWD/services/mobile-api/.env.test
cp -rf $PWD/services/market-api/.env.sample $PWD/services/market-api/.env.test
cp -rf $PWD/services/market-ui/.env.sample $PWD/services/market-ui/.env.test
cp -rf $PWD/services/market-ui/.env.sample $PWD/services/market-ui/.env.production
cp -rf $PWD/services/office-ui/.env.sample $PWD/services/office-ui/.env.test
cp -rf $PWD/services/office-ui/.env.sample $PWD/services/office-ui/.env.production
cp -rf $PWD/services/core-eth/.env.sample $PWD/services/core-eth/.env.test
cp -rf $PWD/microservices/eml/.env.sample $PWD/microservices/eml/.env.test
cp -rf $PWD/microservices/game/.env.sample $PWD/microservices/game/.env.test
cp -rf $PWD/microservices/json/.env.sample $PWD/microservices/json/.env.test

echo -e "\033[34mAll done!\n\033[0m";


