import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import {
  ERC1155Simple,
  ERC721MysteryboxTest,
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
// import { shouldGetTokenURI } from "../../ERC721/shared/common/tokenURI";
// import { shouldSetBaseURI } from "../../ERC721/shared/common/setBaseURI";
import { randomRequest } from "../../shared/randomRequest";
import { deployLinkVrfFixture } from "../../shared/link";

describe("ERC721MysteryboxSimple", function () {
  let mysteryboxInstance: ERC721MysteryboxTest;
  let erc721SimpleInstance: ERC721Simple;
  let erc1155SimpleInstance: ERC1155Simple;

  let erc721RandomInstance: ERC721RandomHardhat;
  let linkInstance: LinkErc20;
  let vrfInstance: VRFCoordinatorMock;

  before(async function () {
    await network.provider.send("hardhat_reset");

    // https://github.com/NomicFoundation/hardhat/issues/2980
    ({ linkInstance, vrfInstance } = await loadFixture(function mysterybox() {
      return deployLinkVrfFixture();
    }));

    expect(linkInstance.address).equal(LINK_ADDR);
    expect(vrfInstance.address).equal(VRF_ADDR);
  });

  after(async function () {
    await network.provider.send("hardhat_reset");
  });

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const mysteryboxFactory = await ethers.getContractFactory("ERC721MysteryboxTest");
    mysteryboxInstance = await mysteryboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    const erc721SimpleFactory = await ethers.getContractFactory("ERC721Simple");
    erc721SimpleInstance = await erc721SimpleFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

    const erc1155SimpleFactory = await ethers.getContractFactory("ERC1155Simple");
    erc1155SimpleInstance = await erc1155SimpleFactory.deploy(royalty, baseTokenURI);
    await erc1155SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

    // ERC721 Random
    const erc721randomFactory = await ethers.getContractFactory("ERC721RandomHardhat"); // for test only
    erc721RandomInstance = await erc721randomFactory.deploy("ERC721Random", "RND", royalty, baseTokenURI);
    // Grant roles
    await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
    await erc721RandomInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);
    // Fund LINK to erc721Random contract
    await linkInstance.transfer(erc721RandomInstance.address, ethers.BigNumber.from("1000").mul(decimals));

    this.contractInstance = mysteryboxInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  // shouldGetTokenURI();
  // shouldSetBaseURI();

  describe("mint", function () {
    it("should mint (singular)", async function () {
      const tx1 = mysteryboxInstance.mintBox(this.receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId,
          amount: 1,
        },
      ]);

      await expect(tx1)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });

    it("should mint (multiple)", async function () {
      const tx1 = mysteryboxInstance.mintBox(this.receiver.address, templateId, [
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
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });

    it("should fail: No content", async function () {
      const tx1 = mysteryboxInstance.mintBox(this.receiver.address, templateId, []);

      await expect(tx1).to.be.revertedWith("Mysterybox: no content");
    });
  });

  describe("unpack", function () {
    it("should mint (singular)", async function () {
      const tx1 = mysteryboxInstance.mintBox(this.receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId: templateId,
          amount: 1,
        },
      ]);

      await expect(tx1)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const tx2 = mysteryboxInstance.connect(this.receiver).unpack(tokenId);
      await expect(tx2)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(this.receiver.address, ethers.constants.AddressZero, tokenId)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });

    it("should mint Random (singular)", async function () {
      const tx1 = mysteryboxInstance.mintBox(this.receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721RandomInstance.address,
          tokenId: templateId,
          amount: 1,
        },
      ]);

      await expect(tx1)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const tx2 = mysteryboxInstance.connect(this.receiver).unpack(tokenId);
      await expect(tx2)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(this.receiver.address, ethers.constants.AddressZero, tokenId);
      await expect(tx2).to.emit(mysteryboxInstance, "UnpackMysterybox");
      await expect(tx2).to.emit(erc721RandomInstance, "RandomRequest");
      await expect(tx2).to.emit(linkInstance, "Transfer");
      // RANDOM
      await randomRequest(erc721RandomInstance, vrfInstance);
      const balance = await erc721RandomInstance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint (multiple)", async function () {
      const tx1 = mysteryboxInstance.mintBox(this.receiver.address, templateId, [
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
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const tx2 = mysteryboxInstance.connect(this.receiver).unpack(tokenId);
      await expect(tx2)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(this.receiver.address, ethers.constants.AddressZero, tokenId)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId)
        .to.emit(erc1155SimpleInstance, "TransferSingle")
        .withArgs(mysteryboxInstance.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount);
    });
  });
});
