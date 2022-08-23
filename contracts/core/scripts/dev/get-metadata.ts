import { ethers } from "hardhat";

import { blockAwait } from "@gemunion/utils-eth";

async function main() {
  const rlNum = 100; // royaltyNumerator
  const [_owner] = await ethers.getSigners();

  // ERC721 contract - upgradeable
  const itemFactory = await ethers.getContractFactory("ERC721Upgradeable");
  const itemInstance = await itemFactory.deploy("ITEMG", "ITEMG", rlNum, "http://localhost:3011/erc721/1/");
  console.info(`ERC721_G_ADDR=${itemInstance.address.toLowerCase()}`);

  // ERC721 contract - random
  const itemrFactory = await ethers.getContractFactory("ERC721Random");
  const itemrInstance = await itemrFactory.deploy("ITEMR", "ITEMR", rlNum, "http://localhost:3011/erc721/1/");
  console.info(`ERC721_R_ADDR=${itemrInstance.address.toLowerCase()}`);

  // Setup Contracts
  // await blockAwait(ethers.provider);

  // ERC721 getRecordField Template
  const templateKey = await itemInstance.TEMPLATE_ID();
  // 0x0fc35a85ba1ca29b752bf9a41b86d647e116e71f5dc2732341c669884154c3ac
  console.info("templateKey", templateKey);

  // ERC721 getRecordField Template
  const gradeKey = await itemInstance.GRADE();
  // 0x08e1ec9b1b54002f93fd04c8195a36be67f2b6b212f18cc951984bc2411b08ee
  console.info("gradeKey", gradeKey);

  // ERC721 getRecordField Rarity
  const rarityKey = await itemrInstance.RARITY();
  // 0x08e1ec9b1b54002f93fd04c8195a36be67f2b6b212f18cc951984bc2411b08ee
  console.info("rarityKey", rarityKey);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
