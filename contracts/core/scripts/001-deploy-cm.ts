import { ethers } from "hardhat";

async function main() {
  // C.MANAGER
  const vestFactory = await ethers.getContractFactory("ContractManager");
  const vestInstance = await vestFactory.deploy();
  console.info(`CONTRACT_MANAGER_ADDR=${vestInstance.address.toLowerCase()}`);

  // ERC721 Marketplace contract
  const market721Factory = await ethers.getContractFactory("ERC721Marketplace");
  const market721Instance = await market721Factory.deploy("ERC721Marketplace");
  console.info(`ERC721_MARKETPLACE_ADDR=${market721Instance.address.toLowerCase()}`);

  // Craft contract - CraftERC721
  const craft721Factory = await ethers.getContractFactory("ERC1155ERC721Craft");
  const craft721Instance = await craft721Factory.deploy();
  console.info(`ERC721_CRAFT_ADDR=${craft721Instance.address.toLowerCase()}`);

  // ERC721Dropbox contract
  const erc721DropFactory = await ethers.getContractFactory("ERC721Dropbox");
  const erc721DropInstance = await erc721DropFactory.deploy(
    "ERC721Dropbox",
    "DBX",
    "https://fw-json-api.gemunion.io/",
    100,
  );
  console.info(`ERC721_DROPBOX_ADDR=${erc721DropInstance.address.toLowerCase()}`);

  // ERC721Airdrop contract
  const airdropboxFactory = await ethers.getContractFactory("ERC721Airdrop");
  const airdropboxInstance = await airdropboxFactory.deploy(
    "ERC721Airdrop",
    "AIRDROP",
    "https://fw-json-api.gemunion.io/",
    100,
    10000,
  );
  console.info(`ERC721_AIRDROP_ADDR=${airdropboxInstance.address.toLowerCase()}`);

  // CraftERC1155 contract
  const craftFactory = await ethers.getContractFactory("ERC1155ERC1155Craft");
  const craftInstance = await craftFactory.deploy();
  console.info(`ERC1155_CRAFT_ADDR=${craftInstance.address.toLowerCase()}`);

  // ERC1155 Marketplace contract
  const market1155Factory = await ethers.getContractFactory("ERC1155Marketplace");
  const market1155Instance = await market1155Factory.deploy("ERC1155Marketplace");
  console.info(`ERC1155_MARKETPLACE_ADDR=${market1155Instance.address.toLowerCase()}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
