import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import {
  ERC1155Simple,
  ERC721LootboxTest,
  ERC721RandomHardhat,
  ERC721Simple,
  LinkErc20,
  VRFCoordinatorMock,
} from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  decimals,
  DEFAULT_ADMIN_ROLE,
  LINK_ADDR,
  MINTER_ROLE,
  royalty,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
  VRF_ADDR,
} from "../../constants";
import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetTokenURI } from "../../ERC721/shared/tokenURI";
import { shouldSetBaseURI } from "../../ERC721/shared/setBaseURI";
import { randomRequest } from "../Staking/shared/randomRequest";

describe("ERC721Lootbox", function () {
  let lootboxInstance: ERC721LootboxTest;
  let erc721SimpleInstance: ERC721Simple;
  let erc1155SimpleInstance: ERC1155Simple;

  let erc721RandomInstance: ERC721RandomHardhat;
  let linkInstance: LinkErc20;
  let vrfInstance: VRFCoordinatorMock;

  before(async function () {
    const [owner] = await ethers.getSigners();

    // Deploy Chainlink & Vrf contracts
    const link = await ethers.getContractFactory("LinkErc20");
    // linkInstance = link.attach(LINK_ADDR);
    linkInstance = await link.deploy(tokenName, tokenSymbol);
    console.info(`LINK_ADDR=${linkInstance.address}`);
    const linkAmountInWei = BigNumber.from("10000000000000").mul(decimals);
    await linkInstance.mint(owner.address, linkAmountInWei);
    const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
    vrfInstance = await vrfFactory.deploy(linkInstance.address);
    // vrfInstance = vrfFactory.attach(VRF_ADDR);
    console.info(`VRF_ADDR=${vrfInstance.address}`);
    if (
      linkInstance.address.toLowerCase() !== LINK_ADDR.toLowerCase() ||
      vrfInstance.address.toLowerCase() !== VRF_ADDR.toLowerCase()
    ) {
      console.info(`please change LINK_ADDR or VRF_ADDR in ERC721ChainLinkHH`);
    }
  });

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

    // ERC721 Random
    const erc721randomFactory = await ethers.getContractFactory("ERC721RandomHardhat"); // for test only
    erc721RandomInstance = await erc721randomFactory.deploy("ERC721Random", "RND", royalty, baseTokenURI);
    // Grant roles
    await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
    await erc721RandomInstance.grantRole(MINTER_ROLE, lootboxInstance.address);
    // Fund LINK to erc721Random contract
    await linkInstance.transfer(erc721RandomInstance.address, ethers.BigNumber.from("1000").mul(decimals));

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

    it("should mint Random (singular)", async function () {
      const tx1 = lootboxInstance.mintLootbox(this.receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721RandomInstance.address,
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
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId)
        .to.emit(erc721RandomInstance, "RandomRequest")
        .to.emit(linkInstance, "Transfer");

      // RANDOM
      await randomRequest(erc721RandomInstance, vrfInstance, 1);
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
