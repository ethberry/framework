import { expect } from "chai";
import { ethers } from "hardhat";

import { ERC1155Simple, ERC721LootboxTest, ERC721Simple } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  royalty,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";
import { shouldGetTokenURI } from "../../ERC721/shared/tokenURI";
import { shouldSetBaseURI } from "../../ERC721/shared/setBaseURI";

describe("ERC721Lootbox", function () {
  let lootboxInstance: ERC721LootboxTest;
  let erc721SimpleInstance: ERC721Simple;
  let erc1155SimpleInstance: ERC1155Simple;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const lootboxFactory = await ethers.getContractFactory("ERC721LootboxTest");
    lootboxInstance = await lootboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    const erc721SimpleFactory = await ethers.getContractFactory("ERC721Simple");
    erc721SimpleInstance = await erc721SimpleFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721SimpleInstance.grantRole(MINTER_ROLE, lootboxInstance.address);

    const erc1155SimpleFactory = await ethers.getContractFactory("ERC1155Simple");
    erc1155SimpleInstance = await erc1155SimpleFactory.deploy(royalty, baseTokenURI);
    await erc1155SimpleInstance.grantRole(MINTER_ROLE, lootboxInstance.address);

    this.contractInstance = lootboxInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetTokenURI();
  shouldSetBaseURI();

  describe("mint", function () {
    it("should mint (singular)", async function () {
      const tx1 = lootboxInstance.mintLootbox(this.receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId,
          amount: 1,
        },
      ]);

      await expect(tx1)
        .to.emit(lootboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });

    it("should mint (multiple)", async function () {
      const tx1 = lootboxInstance.mintLootbox(this.receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId: templateId,
          amount: 1,
        },
        {
          tokenType: 4,
          token: erc1155SimpleInstance.address,
          tokenId: templateId,
          amount: 1000,
        },
      ]);

      await expect(tx1)
        .to.emit(lootboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });

    it("should fail: No content", async function () {
      const tx1 = lootboxInstance.mintLootbox(this.receiver.address, templateId, []);

      await expect(tx1).to.be.revertedWith("Lootbox: no content");
    });
  });

  describe("unpack", function () {
    it("should mint (singular)", async function () {
      const tx1 = lootboxInstance.mintLootbox(this.receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId: templateId,
          amount: 1,
        },
      ]);

      await expect(tx1)
        .to.emit(lootboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const tx2 = lootboxInstance.connect(this.receiver).unpack(tokenId);
      await expect(tx2)
        .to.emit(lootboxInstance, "Transfer")
        .withArgs(this.receiver.address, ethers.constants.AddressZero, tokenId)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });

    it("should mint (multiple)", async function () {
      const tx1 = lootboxInstance.mintLootbox(this.receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId: templateId,
          amount: 1,
        },
        {
          tokenType: 4,
          token: erc1155SimpleInstance.address,
          tokenId: templateId,
          amount,
        },
      ]);

      await expect(tx1)
        .to.emit(lootboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const tx2 = lootboxInstance.connect(this.receiver).unpack(tokenId);
      await expect(tx2)
        .to.emit(lootboxInstance, "Transfer")
        .withArgs(this.receiver.address, ethers.constants.AddressZero, tokenId)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId)
        .to.emit(erc1155SimpleInstance, "TransferSingle")
        .withArgs(lootboxInstance.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount);
    });
  });
});
