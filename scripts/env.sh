#!/usr/bin/env bash

echo -e "\033[34mEnvironment...\n\033[0m";

lerna exec --parallel --scope @gemunionstudio/solo-public-api --scope @gemunionstudio/solo-public-ui --scope @gemunionstudio/solo-admin-api --scope @gemunionstudio/solo-admin-ui --scope @gemunionstudio/solo-emailer --scope @gemunionstudio/solo-webhooks -- cp -rf .env.sample .env.development
lerna exec --parallel --scope @gemunionstudio/solo-public-api --scope @gemunionstudio/solo-public-ui --scope @gemunionstudio/solo-admin-api --scope @gemunionstudio/solo-admin-ui --scope @gemunionstudio/solo-emailer --scope @gemunionstudio/solo-webhooks -- cp -rf .env.sample .env.test
lerna exec --parallel --scope @gemunionstudio/solo-public-api --scope @gemunionstudio/solo-public-ui --scope @gemunionstudio/solo-admin-api --scope @gemunionstudio/solo-admin-ui --scope @gemunionstudio/solo-emailer --scope @gemunionstudio/solo-webhooks -- cp -rf .env.sample .env.production

