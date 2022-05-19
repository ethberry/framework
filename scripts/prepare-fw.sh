#!/usr/bin/env bash

  BASE_MODE=$1
  BLOCKCHAIN=$2
  CURDIR=$(pwd)
  cp $CURDIR/.env.$BASE_MODE.sample $CURDIR/.env
  ENV_FILE=$CURDIR/.env


# Confirm .env file exists, parse it
if [ -f $ENV_FILE ]; then

  echo "parsing env file.. ${ENV_FILE}"
  # Create tmp clone
  cat $ENV_FILE >.env.tmp

  # Substitutions + fixes -> to .env.tmp2
  cat .env.tmp | sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g" >.env.tmp2

  # Set the vars
  set -a
  source .env.tmp2
  set +a

  # Remove tmp files
  rm .env.tmp .env.tmp2
else
    echo "env file not found"
fi

  echo -e "\033[34mStarting docker compose...\n\033[0m";
  npm run docker:up

  echo -e "\033[34mPreparing contracts...\n\033[0m";

  echo "awaiting blockchain at $JSON_RPC_ADDR ";
  until $(curl --output /dev/null --silent --fail $JSON_RPC_ADDR); do
      printf '.'
      sleep 5
  done

  echo "preparing contracts via hardhat..";

  # Grep output to -> .env.tmp
  npm run prepare:contracts:$BLOCKCHAIN | grep 'ERC20_COIN_ADDR\|ERC20_COIN_BL_ADDR\|CONTRACT_MANAGER_ADDR\|ERC721_ITEM_ADDR\|ERC721_HERO_ADDR\|ERC721_SKILL_ADDR\|ERC721_LAND_ADDR\|ERC721_MARKETPLACE_ADDR\|ERC721_CRAFT_ADDR\|ERC721_AUCTION_ADDR\|ERC721_DROPBOX_ADDR\|ERC721_AIRDROP_ADDR\|ERC1155_RESOURCES_ADDR\|ERC1155_CRAFT_ADDR\|ERC1155_MARKETPLACE_ADDR'>> .env.tmp

  # Substitutions + fixes -> to .env.tmp2
  cat .env.tmp | sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g" >.env.tmp2

    echo "..parsing output "
    echo ""

    # Set the vars
    set -a
    source .env.tmp2
    set +a

    # Remove tmp files
  rm .env.tmp .env.tmp2

  echo "Contracts address:";

  echo "CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR"
  echo "ERC20_COIN_ADDR=$ERC20_COIN_ADDR"
  echo "ERC20_COIN_BL_ADDR=$ERC20_COIN_BL_ADDR"
  echo "ERC721_ITEM_ADDR=$ERC721_ITEM_ADDR"
  echo "ERC721_HERO_ADDR=$ERC721_HERO_ADDR"
  echo "ERC721_SKILL_ADDR=$ERC721_SKILL_ADDR"
  echo "ERC721_LAND_ADDR=$ERC721_LAND_ADDR"
  echo "ERC721_MARKETPLACE_ADDR=$ERC721_MARKETPLACE_ADDR"
  echo "ERC721_CRAFT_ADDR=$ERC721_CRAFT_ADDR"
  echo "ERC721_AUCTION_ADDR=$ERC721_AUCTION_ADDR"
  echo "ERC721_DROPBOX_ADDR=$ERC721_DROPBOX_ADDR"
  echo "ERC721_AIRDROP_ADDR=$ERC721_AIRDROP_ADDR"
  echo "ERC1155_RESOURCES_ADDR=$ERC1155_RESOURCES_ADDR"
  echo "ERC1155_CRAFT_ADDR=$ERC1155_CRAFT_ADDR"
  echo "ERC1155_MARKETPLACE_ADDR=$ERC1155_MARKETPLACE_ADDR"
  echo ""

  echo "done with contract's addrs"
  echo ""

  echo "setting-up ADMIN UI .env.$BASE_MODE"

  cp $CURDIR/services/admin-ui/.env.sample $CURDIR/services/admin-ui/.env.$BASE_MODE

    ADMIN_BE_URL=$(echo $ADMIN_BE_URL | sed 's#/#\\/#g')
    JSON_RPC_ADDR=$(echo $JSON_RPC_ADDR | sed 's#/#\\/#g')
    WEBSOCKET_ADDR=$(echo $WEBSOCKET_ADDR | sed 's#/#\\/#g')

  sed -i -e "s/BE_URL=.*/BE_URL=$ADMIN_BE_URL/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/JSON_RPC_ADDR=.*/JSON_RPC_ADDR=$JSON_RPC_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/WEBSOCKET_ADDR=.*/WEBSOCKET_ADDR=$WEBSOCKET_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/CHAIN_ID=.*/CHAIN_ID=$CHAIN_ID/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ACCOUNT=.*/ACCOUNT=$ACCOUNT/g" $CURDIR/services/admin-ui/.env.$BASE_MODE

  sed -i -e "s/CONTRACT_MANAGER_ADDR=.*/CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_ADDR=.*/ERC20_COIN_ADDR=$ERC20_COIN_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_BL_ADDR=.*/ERC20_COIN_BL_ADDR=$ERC20_COIN_BL_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_ITEM_ADDR=.*/ERC721_ITEM_ADDR=$ERC721_ITEM_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_HERO_ADDR=.*/ERC721_HERO_ADDR=$ERC721_HERO_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_SKILL_ADDR=.*/ERC721_SKILL_ADDR=$ERC721_SKILL_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_LAND_ADDR=.*/ERC721_LAND_ADDR=$ERC721_LAND_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_MARKETPLACE_ADDR=.*/ERC721_MARKETPLACE_ADDR=$ERC721_MARKETPLACE_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_CRAFT_ADDR=.*/ERC721_CRAFT_ADDR=$ERC721_CRAFT_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_AUCTION_ADDR=.*/ERC721_AUCTION_ADDR=$ERC721_AUCTION_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_DROPBOX_ADDR=.*/ERC721_DROPBOX_ADDR=$ERC721_DROPBOX_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_AIRDROP_ADDR=.*/ERC721_AIRDROP_ADDR=$ERC721_AIRDROP_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC1155_RESOURCES_ADDR=.*/ERC1155_RESOURCES_ADDR=$ERC1155_RESOURCES_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC1155_CRAFT_ADDR=.*/ERC1155_CRAFT_ADDR=$ERC1155_CRAFT_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  sed -i -e "s/ERC1155_MARKETPLACE_ADDR=.*/ERC1155_MARKETPLACE_ADDR=$ERC1155_MARKETPLACE_ADDR/g" $CURDIR/services/admin-ui/.env.$BASE_MODE
  rm $CURDIR/services/admin-ui/.env.$BASE_MODE-e

  echo "setting-up MARKET UI .env.$BASE_MODE"

  cp $CURDIR/services/market-ui/.env.sample $CURDIR/services/market-ui/.env.$BASE_MODE

    MARKET_BE_URL=$(echo $MARKET_BE_URL | sed 's#/#\\/#g')

  sed -i -e "s/BE_URL=.*/BE_URL=$MARKET_BE_URL/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/JSON_RPC_ADDR=.*/JSON_RPC_ADDR=$JSON_RPC_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/WEBSOCKET_ADDR=.*/WEBSOCKET_ADDR=$WEBSOCKET_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/CHAIN_ID=.*/CHAIN_ID=$CHAIN_ID/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ACCOUNT=.*/ACCOUNT=$ACCOUNT/g" $CURDIR/services/market-ui/.env.$BASE_MODE

  sed -i -e "s/CONTRACT_MANAGER_ADDR=.*/CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_ADDR=.*/ERC20_COIN_ADDR=$ERC20_COIN_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_BL_ADDR=.*/ERC20_COIN_BL_ADDR=$ERC20_COIN_BL_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_ITEM_ADDR=.*/ERC721_ITEM_ADDR=$ERC721_ITEM_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_HERO_ADDR=.*/ERC721_HERO_ADDR=$ERC721_HERO_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_SKILL_ADDR=.*/ERC721_SKILL_ADDR=$ERC721_SKILL_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_LAND_ADDR=.*/ERC721_LAND_ADDR=$ERC721_LAND_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_MARKETPLACE_ADDR=.*/ERC721_MARKETPLACE_ADDR=$ERC721_MARKETPLACE_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_CRAFT_ADDR=.*/ERC721_CRAFT_ADDR=$ERC721_CRAFT_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_AUCTION_ADDR=.*/ERC721_AUCTION_ADDR=$ERC721_AUCTION_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_DROPBOX_ADDR=.*/ERC721_DROPBOX_ADDR=$ERC721_DROPBOX_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC721_AIRDROP_ADDR=.*/ERC721_AIRDROP_ADDR=$ERC721_AIRDROP_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC1155_RESOURCES_ADDR=.*/ERC1155_RESOURCES_ADDR=$ERC1155_RESOURCES_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC1155_CRAFT_ADDR=.*/ERC1155_CRAFT_ADDR=$ERC1155_CRAFT_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  sed -i -e "s/ERC1155_MARKETPLACE_ADDR=.*/ERC1155_MARKETPLACE_ADDR=$ERC1155_MARKETPLACE_ADDR/g" $CURDIR/services/market-ui/.env.$BASE_MODE
  rm $CURDIR/services/market-ui/.env.$BASE_MODE-e

  echo "setting-up binance-RPC .env.$BASE_MODE"

  cp $CURDIR/services/binance-rpc/.env.sample $CURDIR/services/binance-rpc/.env.$BASE_MODE

  sed -i -e "s/JSON_RPC_ADDR=.*/JSON_RPC_ADDR=$JSON_RPC_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/WEBSOCKET_ADDR=.*/WEBSOCKET_ADDR=$WEBSOCKET_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/CHAIN_ID=.*/CHAIN_ID=$CHAIN_ID/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ACCOUNT=.*/ACCOUNT=$ACCOUNT/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/PRIVATE_KEY=.*/PRIVATE_KEY=$PRIVATE_KEY/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE

  sed -i -e "s/CONTRACT_MANAGER_ADDR=.*/CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_ADDR=.*/ERC20_COIN_ADDR=$ERC20_COIN_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_BL_ADDR=.*/ERC20_COIN_BL_ADDR=$ERC20_COIN_BL_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_ITEM_ADDR=.*/ERC721_ITEM_ADDR=$ERC721_ITEM_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_HERO_ADDR=.*/ERC721_HERO_ADDR=$ERC721_HERO_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_SKILL_ADDR=.*/ERC721_SKILL_ADDR=$ERC721_SKILL_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_LAND_ADDR=.*/ERC721_LAND_ADDR=$ERC721_LAND_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_MARKETPLACE_ADDR=.*/ERC721_MARKETPLACE_ADDR=$ERC721_MARKETPLACE_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_CRAFT_ADDR=.*/ERC721_CRAFT_ADDR=$ERC721_CRAFT_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_AUCTION_ADDR=.*/ERC721_AUCTION_ADDR=$ERC721_AUCTION_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_DROPBOX_ADDR=.*/ERC721_DROPBOX_ADDR=$ERC721_DROPBOX_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC721_AIRDROP_ADDR=.*/ERC721_AIRDROP_ADDR=$ERC721_AIRDROP_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC1155_RESOURCES_ADDR=.*/ERC1155_RESOURCES_ADDR=$ERC1155_RESOURCES_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC1155_CRAFT_ADDR=.*/ERC1155_CRAFT_ADDR=$ERC1155_CRAFT_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  sed -i -e "s/ERC1155_MARKETPLACE_ADDR=.*/ERC1155_MARKETPLACE_ADDR=$ERC1155_MARKETPLACE_ADDR/g" $CURDIR/services/binance-rpc/.env.$BASE_MODE
  rm $CURDIR/services/binance-rpc/.env.$BASE_MODE-e

  echo "setting-up admin-API .env.$BASE_MODE"

  cp $CURDIR/services/admin-api/.env.sample $CURDIR/services/admin-api/.env.$BASE_MODE

    ADMIN_FE_URL=$(echo $ADMIN_FE_URL | sed 's#/#\\/#g')
    GOOGLE_APPLICATION_CREDENTIALS=$(echo $GOOGLE_APPLICATION_CREDENTIALS | sed 's#/#\\/#g')

  sed -i -e "s/FE_URL=.*/FE_URL=$ADMIN_FE_URL/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/GOOGLE_APPLICATION_CREDENTIALS=.*/GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/JSON_RPC_ADDR=.*/JSON_RPC_ADDR=$JSON_RPC_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/WEBSOCKET_ADDR=.*/WEBSOCKET_ADDR=$WEBSOCKET_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/CHAIN_ID=.*/CHAIN_ID=$CHAIN_ID/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ACCOUNT=.*/ACCOUNT=$ACCOUNT/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/PRIVATE_KEY=.*/PRIVATE_KEY=$PRIVATE_KEY/g" $CURDIR/services/admin-api/.env.$BASE_MODE

  sed -i -e "s/CONTRACT_MANAGER_ADDR=.*/CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_ADDR=.*/ERC20_COIN_ADDR=$ERC20_COIN_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_BL_ADDR=.*/ERC20_COIN_BL_ADDR=$ERC20_COIN_BL_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_ITEM_ADDR=.*/ERC721_ITEM_ADDR=$ERC721_ITEM_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_HERO_ADDR=.*/ERC721_HERO_ADDR=$ERC721_HERO_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_SKILL_ADDR=.*/ERC721_SKILL_ADDR=$ERC721_SKILL_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_LAND_ADDR=.*/ERC721_LAND_ADDR=$ERC721_LAND_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_MARKETPLACE_ADDR=.*/ERC721_MARKETPLACE_ADDR=$ERC721_MARKETPLACE_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_CRAFT_ADDR=.*/ERC721_CRAFT_ADDR=$ERC721_CRAFT_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_AUCTION_ADDR=.*/ERC721_AUCTION_ADDR=$ERC721_AUCTION_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_DROPBOX_ADDR=.*/ERC721_DROPBOX_ADDR=$ERC721_DROPBOX_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_AIRDROP_ADDR=.*/ERC721_AIRDROP_ADDR=$ERC721_AIRDROP_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC1155_RESOURCES_ADDR=.*/ERC1155_RESOURCES_ADDR=$ERC1155_RESOURCES_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC1155_CRAFT_ADDR=.*/ERC1155_CRAFT_ADDR=$ERC1155_CRAFT_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  sed -i -e "s/ERC1155_MARKETPLACE_ADDR=.*/ERC1155_MARKETPLACE_ADDR=$ERC1155_MARKETPLACE_ADDR/g" $CURDIR/services/admin-api/.env.$BASE_MODE
  rm $CURDIR/services/admin-api/.env.$BASE_MODE-e

  echo "setting-up market-API .env.$BASE_MODE"

  cp $CURDIR/services/market-api/.env.sample $CURDIR/services/market-api/.env.$BASE_MODE

    MARKET_FE_URL=$(echo $MARKET_FE_URL | sed 's#/#\\/#g')

  sed -i -e "s/FE_URL=.*/FE_URL=$MARKET_FE_URL/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/GOOGLE_APPLICATION_CREDENTIALS=.*/GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/JSON_RPC_ADDR=.*/JSON_RPC_ADDR=$JSON_RPC_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/WEBSOCKET_ADDR=.*/WEBSOCKET_ADDR=$WEBSOCKET_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/CHAIN_ID=.*/CHAIN_ID=$CHAIN_ID/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ACCOUNT=.*/ACCOUNT=$ACCOUNT/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/PRIVATE_KEY=.*/PRIVATE_KEY=$PRIVATE_KEY/g" $CURDIR/services/market-api/.env.$BASE_MODE

  sed -i -e "s/CONTRACT_MANAGER_ADDR=.*/CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_ADDR=.*/ERC20_COIN_ADDR=$ERC20_COIN_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC20_COIN_BL_ADDR=.*/ERC20_COIN_BL_ADDR=$ERC20_COIN_BL_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_ITEM_ADDR=.*/ERC721_ITEM_ADDR=$ERC721_ITEM_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_HERO_ADDR=.*/ERC721_HERO_ADDR=$ERC721_HERO_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_SKILL_ADDR=.*/ERC721_SKILL_ADDR=$ERC721_SKILL_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_LAND_ADDR=.*/ERC721_LAND_ADDR=$ERC721_LAND_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_MARKETPLACE_ADDR=.*/ERC721_MARKETPLACE_ADDR=$ERC721_MARKETPLACE_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_CRAFT_ADDR=.*/ERC721_CRAFT_ADDR=$ERC721_CRAFT_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_AUCTION_ADDR=.*/ERC721_AUCTION_ADDR=$ERC721_AUCTION_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_DROPBOX_ADDR=.*/ERC721_DROPBOX_ADDR=$ERC721_DROPBOX_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC721_AIRDROP_ADDR=.*/ERC721_AIRDROP_ADDR=$ERC721_AIRDROP_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC1155_RESOURCES_ADDR=.*/ERC1155_RESOURCES_ADDR=$ERC1155_RESOURCES_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC1155_CRAFT_ADDR=.*/ERC1155_CRAFT_ADDR=$ERC1155_CRAFT_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  sed -i -e "s/ERC1155_MARKETPLACE_ADDR=.*/ERC1155_MARKETPLACE_ADDR=$ERC1155_MARKETPLACE_ADDR/g" $CURDIR/services/market-api/.env.$BASE_MODE
  rm $CURDIR/services/market-api/.env.$BASE_MODE-e

  echo "ALL done"

  cd $CURDIR

