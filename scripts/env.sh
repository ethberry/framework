#!/usr/bin/env bash

echo -e "\033[34mEnvironment...\n\033[0m";

lerna exec --parallel --scope @gemunionstudio/framework-public-api --scope @gemunionstudio/framework-public-ui --scope @gemunionstudio/framework-admin-api --scope @gemunionstudio/framework-admin-ui --scope @gemunionstudio/framework-emailer --scope @gemunionstudio/framework-webhooks -- cp -rf .env.sample .env.development
lerna exec --parallel --scope @gemunionstudio/framework-public-api --scope @gemunionstudio/framework-public-ui --scope @gemunionstudio/framework-admin-api --scope @gemunionstudio/framework-admin-ui --scope @gemunionstudio/framework-emailer --scope @gemunionstudio/framework-webhooks -- cp -rf .env.sample .env.test
lerna exec --parallel --scope @gemunionstudio/framework-public-api --scope @gemunionstudio/framework-public-ui --scope @gemunionstudio/framework-admin-api --scope @gemunionstudio/framework-admin-ui --scope @gemunionstudio/framework-emailer --scope @gemunionstudio/framework-webhooks -- cp -rf .env.sample .env.production

