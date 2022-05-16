#!/usr/bin/env bash

echo -e "\033[34mCopy test env files to the services folders...\n\033[0m";

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.

cp -rf $PWD/services/admin-api/.env.sample $PWD/services/admin-api/.env.test
cp -rf $PWD/services/admin-ui/.env.sample $PWD/services/admin-ui/.env.test
cp -rf $PWD/services/market-api/.env.sample $PWD/services/market-api/.env.test
cp -rf $PWD/services/market-ui/.env.sample $PWD/services/market-ui/.env.test
cp -rf $PWD/services/binance-rpc/.env.sample $PWD/services/binance-rpc/.env.test

echo -e "\033[34mAll done!\n\033[0m";


