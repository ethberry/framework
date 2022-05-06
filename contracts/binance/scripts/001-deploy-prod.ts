import { ethers } from "hardhat";

async function main() {
  // Deploy
  // ERC20 Coin
  const coinFactory = await ethers.getContractFactory("Coin");
  const coinInstance = await coinFactory.deploy("UndeadCoin", "UNDEAD", 1000000000);
  console.info(`ERC20_COIN=${coinInstance.address}`);

  // ERC721 Marketplace contract
  const market721Factory = await ethers.getContractFactory("MarketplaceERC721");
  const market721Instance = await market721Factory.deploy("MarketplaceERC721");
  console.info(`ERC721_MARKETPLACE_ADDR=${market721Instance.address}`);

  // ERC1155 Marketplace contract
  const market1155Factory = await ethers.getContractFactory("MarketplaceERC1155");
  const market1155Instance = await market1155Factory.deploy("MarketplaceERC1155");
  console.info(`MARKETPLACE_ERC1155_ADDR=${market1155Instance.address}`);

  // Craft contract - CraftERC1155
  const craftFactory = await ethers.getContractFactory("CraftERC1155");
  const craftInstance = await craftFactory.deploy();
  console.info(`ERC1155_CRAFT_ADDR=${craftInstance.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
