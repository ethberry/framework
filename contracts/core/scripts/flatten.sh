mkdir -p dist

mkdir -p dist/ContractManager
hardhat flatten contracts/ContractManager/ContractManager.sol > dist/ContractManager/ContractManager.sol

mkdir -p dist/ERC20
hardhat flatten contracts/ERC20/ERC20Blacklist.sol > dist/ERC20/ERC20Blacklist.sol
hardhat flatten contracts/ERC20/ERC20Simple.sol > dist/ERC20/ERC20Simple.sol
hardhat flatten contracts/ERC20/ERC20Whitelist.sol > dist/ERC20/ERC20Whitelist.sol

mkdir -p dist/ERC721
hardhat flatten contracts/ERC721/ERC721Blacklist.sol > dist/ERC721/ERC721Blacklist.sol
hardhat flatten contracts/ERC721/ERC721BlacklistRandom.sol > dist/ERC721/ERC721BlacklistRandom.sol
hardhat flatten contracts/ERC721/ERC721BlacklistUpgradeable.sol > dist/ERC721/ERC721BlacklistUpgradeable.sol
hardhat flatten contracts/ERC721/ERC721BlacklistUpgradeableRandom.sol > dist/ERC721/ERC721BlacklistUpgradeableRandom.sol
hardhat flatten contracts/ERC721/ERC721BlacklistUpgradeableRentable.sol > dist/ERC721/ERC721BlacklistUpgradeableRentable.sol
hardhat flatten contracts/ERC721/ERC721BlacklistUpgradeableRentableRandom.sol > dist/ERC721/ERC721BlacklistUpgradeableRentableRandom.sol
hardhat flatten contracts/ERC721/ERC721Genes.sol > dist/ERC721/ERC721Genes.sol
hardhat flatten contracts/ERC721/ERC721Random.sol > dist/ERC721/ERC721Random.sol
hardhat flatten contracts/ERC721/ERC721Rentable.sol > dist/ERC721/ERC721Rentable.sol
hardhat flatten contracts/ERC721/ERC721Simple.sol > dist/ERC721/ERC721Simple.sol
hardhat flatten contracts/ERC721/ERC721Soulbound.sol > dist/ERC721/ERC721Soulbound.sol
hardhat flatten contracts/ERC721/ERC721SoulboundVotes.sol > dist/ERC721/ERC721SoulboundVotes.sol
hardhat flatten contracts/ERC721/ERC721Upgradeable.sol > dist/ERC721/ERC721Upgradeable.sol
hardhat flatten contracts/ERC721/ERC721UpgradeableRandom.sol > dist/ERC721/ERC721UpgradeableRandom.sol
hardhat flatten contracts/ERC721/ERC721UpgradeableRentable.sol > dist/ERC721/ERC721UpgradeableRentable.sol

mkdir -p dist/ERC998
hardhat flatten contracts/ERC998/ERC998Blacklist.sol > dist/ERC998/ERC998Blacklist.sol
hardhat flatten contracts/ERC998/ERC998BlacklistRandom.sol > dist/ERC998/ERC998BlacklistRandom.sol
hardhat flatten contracts/ERC998/ERC998BlacklistUpgradeable.sol > dist/ERC998/ERC998BlacklistUpgradeable.sol
hardhat flatten contracts/ERC998/ERC998BlacklistUpgradeableRandom.sol > dist/ERC998/ERC998BlacklistUpgradeableRandom.sol
hardhat flatten contracts/ERC998/ERC998ERC20Simple.sol > dist/ERC998/ERC998ERC20Simple.sol
hardhat flatten contracts/ERC998/ERC998ERC1155ERC20Simple.sol > dist/ERC998/ERC998ERC1155ERC20Simple.sol
hardhat flatten contracts/ERC998/ERC998ERC1155Simple.sol > dist/ERC998/ERC998ERC1155Simple.sol
hardhat flatten contracts/ERC998/ERC998Genes.sol > dist/ERC998/ERC998Genes.sol
hardhat flatten contracts/ERC998/ERC998Random.sol > dist/ERC998/ERC998Random.sol
hardhat flatten contracts/ERC998/ERC998Rentable.sol > dist/ERC998/ERC998Rentable.sol
hardhat flatten contracts/ERC998/ERC998Simple.sol > dist/ERC998/ERC998Simple.sol
hardhat flatten contracts/ERC998/ERC998StateHash.sol > dist/ERC998/ERC998StateHash.sol
hardhat flatten contracts/ERC998/ERC998Upgradeable.sol > dist/ERC998/ERC998Upgradeable.sol
hardhat flatten contracts/ERC998/ERC998UpgradeableRandom.sol > dist/ERC998/ERC998UpgradeableRandom.sol

mkdir -p dist/ERC1155
hardhat flatten contracts/ERC1155/ERC1155Blacklist.sol > dist/ERC1155/ERC1155Blacklist.sol
hardhat flatten contracts/ERC1155/ERC1155Simple.sol > dist/ERC1155/ERC1155Simple.sol
hardhat flatten contracts/ERC1155/ERC1155Soulbound.sol > dist/ERC1155/ERC1155Soulbound.sol

mkdir -p dist/Exchange
hardhat flatten contracts/Exchange/Exchange.sol > dist/Exchange/Exchange.sol

mkdir -p dist/Mechanics

mkdir -p dist/Mechanics/Breed
hardhat flatten contracts/Mechanics/Breed/Breed.sol > dist/Mechanics/Breed/Breed.sol

mkdir -p dist/Mechanics/Collection
hardhat flatten contracts/Mechanics/Collection/ERC721CBlacklist.sol > dist/Mechanics/Collection/ERC721CBlacklist.sol
hardhat flatten contracts/Mechanics/Collection/ERC721CSimple.sol > dist/Mechanics/Collection/ERC721CSimple.sol

mkdir -p dist/Mechanics/Lottery
hardhat flatten contracts/Mechanics/Lottery/ERC721Lottery.sol > dist/Mechanics/Lottery/ERC721Lottery.sol
hardhat flatten contracts/Mechanics/Lottery/LotteryRandom.sol > dist/Mechanics/Lottery/LotteryRandom.sol

mkdir -p dist/Mechanics/Mysterybox
hardhat flatten contracts/Mechanics/Mysterybox/ERC721MysteryBoxBlacklist.sol > dist/Mechanics/Mysterybox/ERC721MysteryBoxBlacklist.sol
hardhat flatten contracts/Mechanics/Mysterybox/ERC721MysteryBoxBlacklistPausable.sol > dist/Mechanics/Mysterybox/ERC721MysteryBoxBlacklistPausable.sol
hardhat flatten contracts/Mechanics/Mysterybox/ERC721MysteryBoxPausable.sol > dist/Mechanics/Mysterybox/ERC721MysteryBoxPausable.sol
hardhat flatten contracts/Mechanics/Mysterybox/ERC721MysteryBoxSimple.sol > dist/Mechanics/Mysterybox/ERC721MysteryBoxSimple.sol

mkdir -p dist/Mechanics/Pyramid
hardhat flatten contracts/Mechanics/Pyramid/Pyramid.sol > dist/Mechanics/Pyramid/Pyramid.sol

mkdir -p dist/Mechanics/Staking
hardhat flatten contracts/Mechanics/Staking/Staking.sol > dist/Mechanics/Staking/Staking.sol

mkdir -p dist/Mechanics/Vesting
hardhat flatten contracts/Mechanics/Vesting/CliffVesting.sol > dist/Mechanics/Vesting/CliffVesting.sol
hardhat flatten contracts/Mechanics/Vesting/GradedVesting.sol > dist/Mechanics/Vesting/GradedVesting.sol
hardhat flatten contracts/Mechanics/Vesting/LinearVesting.sol > dist/Mechanics/Vesting/LinearVesting.sol

mkdir -p dist/Mechanics/Waitlist
hardhat flatten contracts/Mechanics/Waitlist/Waitlist.sol > dist/Mechanics/Waitlist/Waitlist.sol

mkdir -p dist/Mechanics/Wrapper
hardhat flatten contracts/Mechanics/Wrapper/ERC721Wrapper.sol > dist/Mechanics/Wrapper/ERC721Wrapper.sol



