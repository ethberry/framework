#!/bin/sh

set -e # this will cause the shell to exit immediately if any command exits with a nonzero exit value.
WMODE=$1
#if [ $1 == "clean" ]; then
#echo "\033[34m DELETE PRODuction env files in the services folders!\n\033[0m"
#
#rm ./services/market-api/.env.$WMODE
#rm ./services/market-ui/.env.$WMODE
#rm ./services/admin-api/.env.$WMODE
#rm ./services/admin-ui/.env.$WMODE
#
#echo "\033[34m Done!\n\033[0m"
#
#fi;


if [ -f .env ]
then
  export $(cat ./.env | sed 's/#.*//g' | xargs)

echo $STARTING_BLOCK
echo $CONTRACT_MANAGER_ADDR
echo "\033[34mSetting-Up env files in the services folders...\n\033[0m"
echo STARTING_BLOCK=$STARTING_BLOCK
touch ./services/admin-api/.env.$WMODE
echo STARTING_BLOCK=$STARTING_BLOCK >>./services/admin-api/.env.$WMODE
echo CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR  >>./services/admin-api/.env.$WMODE
echo EXCHANGE_ADDR=$EXCHANGE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC20_SIMPLE_ADDR=$ERC20_SIMPLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC20_INACTIVE_ADDR=$ERC20_INACTIVE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC20_NEW_ADDR=$ERC20_NEW_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC20_BLACKLIST_ADDR=$ERC20_BLACKLIST_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_SIMPLE_ADDR=$ERC721_SIMPLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_INACTIVE_ADDR=$ERC721_INACTIVE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_NEW_ADDR=$ERC721_NEW_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_BLACKLIST_ADDR=$ERC721_BLACKLIST_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_UPGRADEABLE_ADDR=$ERC721_UPGRADEABLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_RANDOM_ADDR=$ERC721_RANDOM_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_SOULBOUND_ADDR=$ERC721_SOULBOUND_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_RENTABLE_ADDR=$ERC721_RENTABLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_GENES_ADDR=$ERC721_GENES_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_SIMPLE_ADDR=$ERC998_SIMPLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_INACTIVE_ADDR=$ERC998_INACTIVE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_NEW_ADDR=$ERC998_NEW_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_BLACKLIST_ADDR=$ERC998_BLACKLIST_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_UPGRADEABLE_ADDR=$ERC998_UPGRADEABLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_RANDOM_ADDR=$ERC998_RANDOM_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_GENES_ADDR=$ERC998_GENES_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_RENTABLE_ADDR=$ERC998_RENTABLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_OWNER_ERC20_ADDR=$ERC998_OWNER_ERC20_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_OWNER_ERC1155_ADDR=$ERC998_OWNER_ERC1155_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC998_OWNER_ERC1155_ERC20_ADDR=$ERC998_OWNER_ERC1155_ERC20_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC1155_SIMPLE_ADDR=$ERC1155_SIMPLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC1155_INACTIVE_ADDR=$ERC1155_INACTIVE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC1155_NEW_ADDR=$ERC1155_NEW_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC1155_BLACKLIST_ADDR=$ERC1155_BLACKLIST_ADDR  >>./services/admin-api/.env.$WMODE
echo VESTING_LINEAR_ADDR=$VESTING_LINEAR_ADDR  >>./services/admin-api/.env.$WMODE
echo VESTING_GRADED_ADDR=$VESTING_GRADED_ADDR  >>./services/admin-api/.env.$WMODE
echo VESTING_CLIFF_ADDR=$VESTING_CLIFF_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_MYSTERYBOX_SIMPLE_ADDR=$ERC721_MYSTERYBOX_SIMPLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_MYSTERYBOX_PAUSABLE_ADDR=$ERC721_MYSTERYBOX_PAUSABLE_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_MYSTERYBOX_BLACKLIST_ADDR=$ERC721_MYSTERYBOX_BLACKLIST_ADDR  >>./services/admin-api/.env.$WMODE
echo STAKING_ADDR=$STAKING_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_LOTTERY_TICKET_ADDR=$ERC721_LOTTERY_TICKET_ADDR  >>./services/admin-api/.env.$WMODE
echo LOTTERY_ADDR=$LOTTERY_ADDR  >>./services/admin-api/.env.$WMODE
echo LOTTERY_WALLET_ADDR=$LOTTERY_WALLET_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_RAFFLE_TICKET_ADDR=$ERC721_RAFFLE_TICKET_ADDR  >>./services/admin-api/.env.$WMODE
echo RAFFLE_ADDR=$RAFFLE_ADDR  >>./services/admin-api/.env.$WMODE
echo RAFFLE_WALLET_ADDR=$RAFFLE_WALLET_ADDR  >>./services/admin-api/.env.$WMODE
echo USDT_ADDR=$USDT_ADDR  >>./services/admin-api/.env.$WMODE
echo BUSD_ADDR=$BUSD_ADDR  >>./services/admin-api/.env.$WMODE
echo WETH_ADDR=$WETH_ADDR  >>./services/admin-api/.env.$WMODE
echo WAITLIST_ADDR=$WAITLIST_ADDR  >>./services/admin-api/.env.$WMODE
echo ERC721_WRAPPER_ADDR=$ERC721_WRAPPER_ADDR  >>./services/admin-api/.env.$WMODE
echo PYRAMID_ADDR=$PYRAMID_ADDR  >>./services/admin-api/.env.$WMODE

touch ./services/admin-ui/.env.$WMODE
echo STARTING_BLOCK=$STARTING_BLOCK >>./services/admin-ui/.env.$WMODE
echo CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR  >>./services/admin-ui/.env.$WMODE
echo EXCHANGE_ADDR=$EXCHANGE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC20_SIMPLE_ADDR=$ERC20_SIMPLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC20_INACTIVE_ADDR=$ERC20_INACTIVE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC20_NEW_ADDR=$ERC20_NEW_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC20_BLACKLIST_ADDR=$ERC20_BLACKLIST_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_SIMPLE_ADDR=$ERC721_SIMPLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_INACTIVE_ADDR=$ERC721_INACTIVE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_NEW_ADDR=$ERC721_NEW_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_BLACKLIST_ADDR=$ERC721_BLACKLIST_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_UPGRADEABLE_ADDR=$ERC721_UPGRADEABLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_RANDOM_ADDR=$ERC721_RANDOM_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_SOULBOUND_ADDR=$ERC721_SOULBOUND_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_RENTABLE_ADDR=$ERC721_RENTABLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_GENES_ADDR=$ERC721_GENES_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_SIMPLE_ADDR=$ERC998_SIMPLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_INACTIVE_ADDR=$ERC998_INACTIVE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_NEW_ADDR=$ERC998_NEW_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_BLACKLIST_ADDR=$ERC998_BLACKLIST_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_UPGRADEABLE_ADDR=$ERC998_UPGRADEABLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_RANDOM_ADDR=$ERC998_RANDOM_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_GENES_ADDR=$ERC998_GENES_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_RENTABLE_ADDR=$ERC998_RENTABLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_OWNER_ERC20_ADDR=$ERC998_OWNER_ERC20_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_OWNER_ERC1155_ADDR=$ERC998_OWNER_ERC1155_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC998_OWNER_ERC1155_ERC20_ADDR=$ERC998_OWNER_ERC1155_ERC20_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC1155_SIMPLE_ADDR=$ERC1155_SIMPLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC1155_INACTIVE_ADDR=$ERC1155_INACTIVE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC1155_NEW_ADDR=$ERC1155_NEW_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC1155_BLACKLIST_ADDR=$ERC1155_BLACKLIST_ADDR  >>./services/admin-ui/.env.$WMODE
echo VESTING_LINEAR_ADDR=$VESTING_LINEAR_ADDR  >>./services/admin-ui/.env.$WMODE
echo VESTING_GRADED_ADDR=$VESTING_GRADED_ADDR  >>./services/admin-ui/.env.$WMODE
echo VESTING_CLIFF_ADDR=$VESTING_CLIFF_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_SIMPLE_ADDR=$ERC721_MYSTERYBOX_SIMPLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_PAUSABLE_ADDR=$ERC721_MYSTERYBOX_PAUSABLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_BLACKLIST_ADDR=$ERC721_MYSTERYBOX_BLACKLIST_ADDR  >>./services/admin-ui/.env.$WMODE
echo STAKING_ADDR=$STAKING_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_LOTTERY_TICKET_ADDR=$ERC721_LOTTERY_TICKET_ADDR  >>./services/admin-ui/.env.$WMODE
echo LOTTERY_ADDR=$LOTTERY_ADDR  >>./services/admin-ui/.env.$WMODE
echo LOTTERY_WALLET_ADDR=$LOTTERY_WALLET_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_RAFFLE_TICKET_ADDR=$ERC721_RAFFLE_TICKET_ADDR  >>./services/admin-ui/.env.$WMODE
echo RAFFLE_ADDR=$RAFFLE_ADDR  >>./services/admin-ui/.env.$WMODE
echo RAFFLE_WALLET_ADDR=$RAFFLE_WALLET_ADDR  >>./services/admin-ui/.env.$WMODE
echo USDT_ADDR=$USDT_ADDR  >>./services/admin-ui/.env.$WMODE
echo BUSD_ADDR=$BUSD_ADDR  >>./services/admin-ui/.env.$WMODE
echo WETH_ADDR=$WETH_ADDR  >>./services/admin-ui/.env.$WMODE
echo WAITLIST_ADDR=$WAITLIST_ADDR  >>./services/admin-ui/.env.$WMODE
echo ERC721_WRAPPER_ADDR=$ERC721_WRAPPER_ADDR  >>./services/admin-ui/.env.$WMODE
echo PYRAMID_ADDR=$PYRAMID_ADDR  >>./services/admin-ui/.env.$WMODE

touch ./services/market-ui/.env.$WMODE
echo STARTING_BLOCK=$STARTING_BLOCK >>./services/market-ui/.env.$WMODE
echo CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR  >>./services/market-ui/.env.$WMODE
echo EXCHANGE_ADDR=$EXCHANGE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC20_SIMPLE_ADDR=$ERC20_SIMPLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC20_INACTIVE_ADDR=$ERC20_INACTIVE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC20_NEW_ADDR=$ERC20_NEW_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC20_BLACKLIST_ADDR=$ERC20_BLACKLIST_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_SIMPLE_ADDR=$ERC721_SIMPLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_INACTIVE_ADDR=$ERC721_INACTIVE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_NEW_ADDR=$ERC721_NEW_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_BLACKLIST_ADDR=$ERC721_BLACKLIST_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_UPGRADEABLE_ADDR=$ERC721_UPGRADEABLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_RANDOM_ADDR=$ERC721_RANDOM_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_SOULBOUND_ADDR=$ERC721_SOULBOUND_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_RENTABLE_ADDR=$ERC721_RENTABLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_GENES_ADDR=$ERC721_GENES_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_SIMPLE_ADDR=$ERC998_SIMPLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_INACTIVE_ADDR=$ERC998_INACTIVE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_NEW_ADDR=$ERC998_NEW_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_BLACKLIST_ADDR=$ERC998_BLACKLIST_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_UPGRADEABLE_ADDR=$ERC998_UPGRADEABLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_RANDOM_ADDR=$ERC998_RANDOM_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_GENES_ADDR=$ERC998_GENES_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_RENTABLE_ADDR=$ERC998_RENTABLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_OWNER_ERC20_ADDR=$ERC998_OWNER_ERC20_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_OWNER_ERC1155_ADDR=$ERC998_OWNER_ERC1155_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC998_OWNER_ERC1155_ERC20_ADDR=$ERC998_OWNER_ERC1155_ERC20_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC1155_SIMPLE_ADDR=$ERC1155_SIMPLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC1155_INACTIVE_ADDR=$ERC1155_INACTIVE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC1155_NEW_ADDR=$ERC1155_NEW_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC1155_BLACKLIST_ADDR=$ERC1155_BLACKLIST_ADDR  >>./services/market-ui/.env.$WMODE
echo VESTING_LINEAR_ADDR=$VESTING_LINEAR_ADDR  >>./services/market-ui/.env.$WMODE
echo VESTING_GRADED_ADDR=$VESTING_GRADED_ADDR  >>./services/market-ui/.env.$WMODE
echo VESTING_CLIFF_ADDR=$VESTING_CLIFF_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_SIMPLE_ADDR=$ERC721_MYSTERYBOX_SIMPLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_PAUSABLE_ADDR=$ERC721_MYSTERYBOX_PAUSABLE_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_BLACKLIST_ADDR=$ERC721_MYSTERYBOX_BLACKLIST_ADDR  >>./services/market-ui/.env.$WMODE
echo STAKING_ADDR=$STAKING_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_LOTTERY_TICKET_ADDR=$ERC721_LOTTERY_TICKET_ADDR  >>./services/market-ui/.env.$WMODE
echo LOTTERY_ADDR=$LOTTERY_ADDR  >>./services/market-ui/.env.$WMODE
echo LOTTERY_WALLET_ADDR=$LOTTERY_WALLET_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_RAFFLE_TICKET_ADDR=$ERC721_RAFFLE_TICKET_ADDR  >>./services/market-ui/.env.$WMODE
echo RAFFLE_ADDR=$RAFFLE_ADDR  >>./services/market-ui/.env.$WMODE
echo RAFFLE_WALLET_ADDR=$RAFFLE_WALLET_ADDR  >>./services/market-ui/.env.$WMODE
echo USDT_ADDR=$USDT_ADDR  >>./services/market-ui/.env.$WMODE
echo BUSD_ADDR=$BUSD_ADDR  >>./services/market-ui/.env.$WMODE
echo WETH_ADDR=$WETH_ADDR  >>./services/market-ui/.env.$WMODE
echo WAITLIST_ADDR=$WAITLIST_ADDR  >>./services/market-ui/.env.$WMODE
echo ERC721_WRAPPER_ADDR=$ERC721_WRAPPER_ADDR  >>./services/market-ui/.env.$WMODE
echo PYRAMID_ADDR=$PYRAMID_ADDR  >>./services/market-ui/.env.$WMODE

touch ./services/market-api/.env.$WMODE
echo STARTING_BLOCK=$STARTING_BLOCK >>./services/market-api/.env.$WMODE
echo CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR  >>./services/market-api/.env.$WMODE
echo EXCHANGE_ADDR=$EXCHANGE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC20_SIMPLE_ADDR=$ERC20_SIMPLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC20_INACTIVE_ADDR=$ERC20_INACTIVE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC20_NEW_ADDR=$ERC20_NEW_ADDR  >>./services/market-api/.env.$WMODE
echo ERC20_BLACKLIST_ADDR=$ERC20_BLACKLIST_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_SIMPLE_ADDR=$ERC721_SIMPLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_INACTIVE_ADDR=$ERC721_INACTIVE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_NEW_ADDR=$ERC721_NEW_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_BLACKLIST_ADDR=$ERC721_BLACKLIST_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_UPGRADEABLE_ADDR=$ERC721_UPGRADEABLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_RANDOM_ADDR=$ERC721_RANDOM_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_SOULBOUND_ADDR=$ERC721_SOULBOUND_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_RENTABLE_ADDR=$ERC721_RENTABLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_GENES_ADDR=$ERC721_GENES_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_SIMPLE_ADDR=$ERC998_SIMPLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_INACTIVE_ADDR=$ERC998_INACTIVE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_NEW_ADDR=$ERC998_NEW_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_BLACKLIST_ADDR=$ERC998_BLACKLIST_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_UPGRADEABLE_ADDR=$ERC998_UPGRADEABLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_RANDOM_ADDR=$ERC998_RANDOM_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_GENES_ADDR=$ERC998_GENES_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_RENTABLE_ADDR=$ERC998_RENTABLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_OWNER_ERC20_ADDR=$ERC998_OWNER_ERC20_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_OWNER_ERC1155_ADDR=$ERC998_OWNER_ERC1155_ADDR  >>./services/market-api/.env.$WMODE
echo ERC998_OWNER_ERC1155_ERC20_ADDR=$ERC998_OWNER_ERC1155_ERC20_ADDR  >>./services/market-api/.env.$WMODE
echo ERC1155_SIMPLE_ADDR=$ERC1155_SIMPLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC1155_INACTIVE_ADDR=$ERC1155_INACTIVE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC1155_NEW_ADDR=$ERC1155_NEW_ADDR  >>./services/market-api/.env.$WMODE
echo ERC1155_BLACKLIST_ADDR=$ERC1155_BLACKLIST_ADDR  >>./services/market-api/.env.$WMODE
echo VESTING_LINEAR_ADDR=$VESTING_LINEAR_ADDR  >>./services/market-api/.env.$WMODE
echo VESTING_GRADED_ADDR=$VESTING_GRADED_ADDR  >>./services/market-api/.env.$WMODE
echo VESTING_CLIFF_ADDR=$VESTING_CLIFF_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_MYSTERYBOX_SIMPLE_ADDR=$ERC721_MYSTERYBOX_SIMPLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_MYSTERYBOX_PAUSABLE_ADDR=$ERC721_MYSTERYBOX_PAUSABLE_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_MYSTERYBOX_BLACKLIST_ADDR=$ERC721_MYSTERYBOX_BLACKLIST_ADDR  >>./services/market-api/.env.$WMODE
echo STAKING_ADDR=$STAKING_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_LOTTERY_TICKET_ADDR=$ERC721_LOTTERY_TICKET_ADDR  >>./services/market-api/.env.$WMODE
echo LOTTERY_ADDR=$LOTTERY_ADDR  >>./services/market-api/.env.$WMODE
echo LOTTERY_WALLET_ADDR=$LOTTERY_WALLET_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_RAFFLE_TICKET_ADDR=$ERC721_RAFFLE_TICKET_ADDR  >>./services/market-api/.env.$WMODE
echo RAFFLE_ADDR=$RAFFLE_ADDR  >>./services/market-api/.env.$WMODE
echo RAFFLE_WALLET_ADDR=$RAFFLE_WALLET_ADDR  >>./services/market-api/.env.$WMODE
echo USDT_ADDR=$USDT_ADDR  >>./services/market-api/.env.$WMODE
echo BUSD_ADDR=$BUSD_ADDR  >>./services/market-api/.env.$WMODE
echo WETH_ADDR=$WETH_ADDR  >>./services/market-api/.env.$WMODE
echo WAITLIST_ADDR=$WAITLIST_ADDR  >>./services/market-api/.env.$WMODE
echo ERC721_WRAPPER_ADDR=$ERC721_WRAPPER_ADDR  >>./services/market-api/.env.$WMODE
echo PYRAMID_ADDR=$PYRAMID_ADDR  >>./services/market-api/.env.$WMODE


touch ./services/core-eth/.env.$WMODE
echo STARTING_BLOCK=$STARTING_BLOCK >>./services/core-eth/.env.$WMODE
echo CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR  >>./services/core-eth/.env.$WMODE
echo EXCHANGE_ADDR=$EXCHANGE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC20_SIMPLE_ADDR=$ERC20_SIMPLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC20_INACTIVE_ADDR=$ERC20_INACTIVE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC20_NEW_ADDR=$ERC20_NEW_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC20_BLACKLIST_ADDR=$ERC20_BLACKLIST_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_SIMPLE_ADDR=$ERC721_SIMPLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_INACTIVE_ADDR=$ERC721_INACTIVE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_NEW_ADDR=$ERC721_NEW_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_BLACKLIST_ADDR=$ERC721_BLACKLIST_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_UPGRADEABLE_ADDR=$ERC721_UPGRADEABLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_RANDOM_ADDR=$ERC721_RANDOM_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_SOULBOUND_ADDR=$ERC721_SOULBOUND_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_RENTABLE_ADDR=$ERC721_RENTABLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_GENES_ADDR=$ERC721_GENES_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_SIMPLE_ADDR=$ERC998_SIMPLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_INACTIVE_ADDR=$ERC998_INACTIVE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_NEW_ADDR=$ERC998_NEW_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_BLACKLIST_ADDR=$ERC998_BLACKLIST_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_UPGRADEABLE_ADDR=$ERC998_UPGRADEABLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_RANDOM_ADDR=$ERC998_RANDOM_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_GENES_ADDR=$ERC998_GENES_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_RENTABLE_ADDR=$ERC998_RENTABLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_OWNER_ERC20_ADDR=$ERC998_OWNER_ERC20_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_OWNER_ERC1155_ADDR=$ERC998_OWNER_ERC1155_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC998_OWNER_ERC1155_ERC20_ADDR=$ERC998_OWNER_ERC1155_ERC20_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC1155_SIMPLE_ADDR=$ERC1155_SIMPLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC1155_INACTIVE_ADDR=$ERC1155_INACTIVE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC1155_NEW_ADDR=$ERC1155_NEW_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC1155_BLACKLIST_ADDR=$ERC1155_BLACKLIST_ADDR  >>./services/core-eth/.env.$WMODE
echo VESTING_LINEAR_ADDR=$VESTING_LINEAR_ADDR  >>./services/core-eth/.env.$WMODE
echo VESTING_GRADED_ADDR=$VESTING_GRADED_ADDR  >>./services/core-eth/.env.$WMODE
echo VESTING_CLIFF_ADDR=$VESTING_CLIFF_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_MYSTERYBOX_SIMPLE_ADDR=$ERC721_MYSTERYBOX_SIMPLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_MYSTERYBOX_PAUSABLE_ADDR=$ERC721_MYSTERYBOX_PAUSABLE_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_MYSTERYBOX_BLACKLIST_ADDR=$ERC721_MYSTERYBOX_BLACKLIST_ADDR  >>./services/core-eth/.env.$WMODE
echo STAKING_ADDR=$STAKING_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_LOTTERY_TICKET_ADDR=$ERC721_LOTTERY_TICKET_ADDR  >>./services/core-eth/.env.$WMODE
echo LOTTERY_ADDR=$LOTTERY_ADDR  >>./services/core-eth/.env.$WMODE
echo LOTTERY_WALLET_ADDR=$LOTTERY_WALLET_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_RAFFLE_TICKET_ADDR=$ERC721_RAFFLE_TICKET_ADDR  >>./services/core-eth/.env.$WMODE
echo RAFFLE_ADDR=$RAFFLE_ADDR  >>./services/core-eth/.env.$WMODE
echo RAFFLE_WALLET_ADDR=$RAFFLE_WALLET_ADDR  >>./services/core-eth/.env.$WMODE
echo USDT_ADDR=$USDT_ADDR  >>./services/core-eth/.env.$WMODE
echo BUSD_ADDR=$BUSD_ADDR  >>./services/core-eth/.env.$WMODE
echo WETH_ADDR=$WETH_ADDR  >>./services/core-eth/.env.$WMODE
echo WAITLIST_ADDR=$WAITLIST_ADDR  >>./services/core-eth/.env.$WMODE
echo ERC721_WRAPPER_ADDR=$ERC721_WRAPPER_ADDR  >>./services/core-eth/.env.$WMODE
echo PYRAMID_ADDR=$PYRAMID_ADDR  >>./services/core-eth/.env.$WMODE


touch ./services/office-ui/.env.$WMODE
echo STARTING_BLOCK=$STARTING_BLOCK >>./services/office-ui/.env.$WMODE
echo CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR  >>./services/office-ui/.env.$WMODE
echo EXCHANGE_ADDR=$EXCHANGE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC20_SIMPLE_ADDR=$ERC20_SIMPLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC20_INACTIVE_ADDR=$ERC20_INACTIVE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC20_NEW_ADDR=$ERC20_NEW_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC20_BLACKLIST_ADDR=$ERC20_BLACKLIST_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_SIMPLE_ADDR=$ERC721_SIMPLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_INACTIVE_ADDR=$ERC721_INACTIVE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_NEW_ADDR=$ERC721_NEW_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_BLACKLIST_ADDR=$ERC721_BLACKLIST_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_UPGRADEABLE_ADDR=$ERC721_UPGRADEABLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_RANDOM_ADDR=$ERC721_RANDOM_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_SOULBOUND_ADDR=$ERC721_SOULBOUND_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_RENTABLE_ADDR=$ERC721_RENTABLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_GENES_ADDR=$ERC721_GENES_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_SIMPLE_ADDR=$ERC998_SIMPLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_INACTIVE_ADDR=$ERC998_INACTIVE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_NEW_ADDR=$ERC998_NEW_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_BLACKLIST_ADDR=$ERC998_BLACKLIST_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_UPGRADEABLE_ADDR=$ERC998_UPGRADEABLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_RANDOM_ADDR=$ERC998_RANDOM_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_GENES_ADDR=$ERC998_GENES_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_RENTABLE_ADDR=$ERC998_RENTABLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_OWNER_ERC20_ADDR=$ERC998_OWNER_ERC20_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_OWNER_ERC1155_ADDR=$ERC998_OWNER_ERC1155_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC998_OWNER_ERC1155_ERC20_ADDR=$ERC998_OWNER_ERC1155_ERC20_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC1155_SIMPLE_ADDR=$ERC1155_SIMPLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC1155_INACTIVE_ADDR=$ERC1155_INACTIVE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC1155_NEW_ADDR=$ERC1155_NEW_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC1155_BLACKLIST_ADDR=$ERC1155_BLACKLIST_ADDR  >>./services/office-ui/.env.$WMODE
echo VESTING_LINEAR_ADDR=$VESTING_LINEAR_ADDR  >>./services/office-ui/.env.$WMODE
echo VESTING_GRADED_ADDR=$VESTING_GRADED_ADDR  >>./services/office-ui/.env.$WMODE
echo VESTING_CLIFF_ADDR=$VESTING_CLIFF_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_SIMPLE_ADDR=$ERC721_MYSTERYBOX_SIMPLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_PAUSABLE_ADDR=$ERC721_MYSTERYBOX_PAUSABLE_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_MYSTERYBOX_BLACKLIST_ADDR=$ERC721_MYSTERYBOX_BLACKLIST_ADDR  >>./services/office-ui/.env.$WMODE
echo STAKING_ADDR=$STAKING_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_LOTTERY_TICKET_ADDR=$ERC721_LOTTERY_TICKET_ADDR  >>./services/office-ui/.env.$WMODE
echo LOTTERY_ADDR=$LOTTERY_ADDR  >>./services/office-ui/.env.$WMODE
echo LOTTERY_WALLET_ADDR=$LOTTERY_WALLET_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_RAFFLE_TICKET_ADDR=$ERC721_RAFFLE_TICKET_ADDR  >>./services/office-ui/.env.$WMODE
echo RAFFLE_ADDR=$RAFFLE_ADDR  >>./services/office-ui/.env.$WMODE
echo RAFFLE_WALLET_ADDR=$RAFFLE_WALLET_ADDR  >>./services/office-ui/.env.$WMODE
echo USDT_ADDR=$USDT_ADDR  >>./services/office-ui/.env.$WMODE
echo BUSD_ADDR=$BUSD_ADDR  >>./services/office-ui/.env.$WMODE
echo WETH_ADDR=$WETH_ADDR  >>./services/office-ui/.env.$WMODE
echo WAITLIST_ADDR=$WAITLIST_ADDR  >>./services/office-ui/.env.$WMODE
echo ERC721_WRAPPER_ADDR=$ERC721_WRAPPER_ADDR  >>./services/office-ui/.env.$WMODE
echo PYRAMID_ADDR=$PYRAMID_ADDR  >>./services/office-ui/.env.$WMODE

touch ./services/office-api/.env.$WMODE
echo STARTING_BLOCK=$STARTING_BLOCK >>./services/office-api/.env.$WMODE
echo CONTRACT_MANAGER_ADDR=$CONTRACT_MANAGER_ADDR  >>./services/office-api/.env.$WMODE
echo EXCHANGE_ADDR=$EXCHANGE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC20_SIMPLE_ADDR=$ERC20_SIMPLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC20_INACTIVE_ADDR=$ERC20_INACTIVE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC20_NEW_ADDR=$ERC20_NEW_ADDR  >>./services/office-api/.env.$WMODE
echo ERC20_BLACKLIST_ADDR=$ERC20_BLACKLIST_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_SIMPLE_ADDR=$ERC721_SIMPLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_INACTIVE_ADDR=$ERC721_INACTIVE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_NEW_ADDR=$ERC721_NEW_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_BLACKLIST_ADDR=$ERC721_BLACKLIST_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_UPGRADEABLE_ADDR=$ERC721_UPGRADEABLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_RANDOM_ADDR=$ERC721_RANDOM_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_SOULBOUND_ADDR=$ERC721_SOULBOUND_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_RENTABLE_ADDR=$ERC721_RENTABLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_GENES_ADDR=$ERC721_GENES_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_SIMPLE_ADDR=$ERC998_SIMPLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_INACTIVE_ADDR=$ERC998_INACTIVE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_NEW_ADDR=$ERC998_NEW_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_BLACKLIST_ADDR=$ERC998_BLACKLIST_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_UPGRADEABLE_ADDR=$ERC998_UPGRADEABLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_RANDOM_ADDR=$ERC998_RANDOM_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_GENES_ADDR=$ERC998_GENES_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_RENTABLE_ADDR=$ERC998_RENTABLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_OWNER_ERC20_ADDR=$ERC998_OWNER_ERC20_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_OWNER_ERC1155_ADDR=$ERC998_OWNER_ERC1155_ADDR  >>./services/office-api/.env.$WMODE
echo ERC998_OWNER_ERC1155_ERC20_ADDR=$ERC998_OWNER_ERC1155_ERC20_ADDR  >>./services/office-api/.env.$WMODE
echo ERC1155_SIMPLE_ADDR=$ERC1155_SIMPLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC1155_INACTIVE_ADDR=$ERC1155_INACTIVE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC1155_NEW_ADDR=$ERC1155_NEW_ADDR  >>./services/office-api/.env.$WMODE
echo ERC1155_BLACKLIST_ADDR=$ERC1155_BLACKLIST_ADDR  >>./services/office-api/.env.$WMODE
echo VESTING_LINEAR_ADDR=$VESTING_LINEAR_ADDR  >>./services/office-api/.env.$WMODE
echo VESTING_GRADED_ADDR=$VESTING_GRADED_ADDR  >>./services/office-api/.env.$WMODE
echo VESTING_CLIFF_ADDR=$VESTING_CLIFF_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_MYSTERYBOX_SIMPLE_ADDR=$ERC721_MYSTERYBOX_SIMPLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_MYSTERYBOX_PAUSABLE_ADDR=$ERC721_MYSTERYBOX_PAUSABLE_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_MYSTERYBOX_BLACKLIST_ADDR=$ERC721_MYSTERYBOX_BLACKLIST_ADDR  >>./services/office-api/.env.$WMODE
echo STAKING_ADDR=$STAKING_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_LOTTERY_TICKET_ADDR=$ERC721_LOTTERY_TICKET_ADDR  >>./services/office-api/.env.$WMODE
echo LOTTERY_ADDR=$LOTTERY_ADDR  >>./services/office-api/.env.$WMODE
echo LOTTERY_WALLET_ADDR=$LOTTERY_WALLET_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_RAFFLE_TICKET_ADDR=$ERC721_RAFFLE_TICKET_ADDR  >>./services/office-api/.env.$WMODE
echo RAFFLE_ADDR=$RAFFLE_ADDR  >>./services/office-api/.env.$WMODE
echo RAFFLE_WALLET_ADDR=$RAFFLE_WALLET_ADDR  >>./services/office-api/.env.$WMODE
echo USDT_ADDR=$USDT_ADDR  >>./services/office-api/.env.$WMODE
echo BUSD_ADDR=$BUSD_ADDR  >>./services/office-api/.env.$WMODE
echo WETH_ADDR=$WETH_ADDR  >>./services/office-api/.env.$WMODE
echo WAITLIST_ADDR=$WAITLIST_ADDR  >>./services/office-api/.env.$WMODE
echo ERC721_WRAPPER_ADDR=$ERC721_WRAPPER_ADDR  >>./services/office-api/.env.$WMODE
echo PYRAMID_ADDR=$PYRAMID_ADDR  >>./services/office-api/.env.$WMODE

echo "\033[34mAll done!\n\033[0m"

fi;
