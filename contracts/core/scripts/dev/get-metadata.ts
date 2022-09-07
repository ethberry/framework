import { ethers } from "hardhat";

// import { blockAwait } from "@gemunion/utils-eth";
import { baseTokenURI } from "../../test/constants";

async function main() {
  const rlNum = 100; // royaltyNumerator
  const [_owner] = await ethers.getSigners();

  // ERC721 contract - upgradeable
  const itemUpgradeableFactory = await ethers.getContractFactory("ERC721Upgradeable");
  const itemUpgradeableInstance = await itemUpgradeableFactory.deploy("ITEMG", "ITEMG", rlNum, baseTokenURI);
  console.info(`ERC721_G_ADDR=${itemUpgradeableInstance.address.toLowerCase()}`);

  // ERC721 contract - random
  const itemRandomFactory = await ethers.getContractFactory("ERC721Random");
  const itemRandomInstance = await itemRandomFactory.deploy("ITEMR", "ITEMR", rlNum, baseTokenURI);
  console.info(`ERC721_R_ADDR=${itemRandomInstance.address.toLowerCase()}`);

  // ERC721 contract - random
  const itemGenesFactory = await ethers.getContractFactory("ERC721Genes");
  const itemGenesInstance = await itemGenesFactory.deploy("ITEMG", "ITEMG", rlNum, baseTokenURI);
  console.info(`ERC721_R_ADDR=${itemGenesInstance.address.toLowerCase()}`);

  // Setup Contracts
  // await blockAwait(ethers.provider);

  // ERC721 getRecordField Template
  const templateKey = await itemUpgradeableInstance.TEMPLATE_ID();
  // 0xe2db241bb2fe321e8c078a17b0902f9429cee78d5f3486725d73d0356e97c842
  console.info("templateKey", templateKey);

  // ERC721 getRecordField Template
  const gradeKey = await itemUpgradeableInstance.GRADE();
  // 0x76e34cd5c7c46b6bfe6b1da94d54447ea83a4af449bc62a0ef3ecae24c08031a
  console.info("gradeKey", gradeKey);

  // ERC721 getRecordField Rarity
  const rarityKey = await itemRandomInstance.RARITY();
  // 0xda9488a573bb2899ea5782d71e9ebaeb1d8291bf3812a066ec86608a697c51fc
  console.info("rarityKey", rarityKey);

  // ERC721 getRecordField Genes
  const genesKey = await itemGenesInstance.GENES();
  // 0x8e3ddc4aa9e11e826949389b9fc38032713cef66f38657aa6e1599905d26e564
  console.info("genesKey", genesKey);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
