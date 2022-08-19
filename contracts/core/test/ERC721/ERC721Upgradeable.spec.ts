import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  royalty,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetTokenURI } from "./shared/tokenURI";
import { shouldSetBaseURI } from "./shared/setBaseURI";
import { shouldMintCommon } from "./shared/mintCommon";
import { shouldMint } from "./shared/mint";
import { shouldSafeMint } from "./shared/safeMint";

describe("ERC721Upgradeable", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721Upgradeable");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
    this.erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

    const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
    this.erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetTokenURI();
  shouldSetBaseURI();

  shouldMintCommon();
  shouldMint();
  shouldSafeMint();

  describe("getRecordFieldValue", function () {
    it("should get record field value", async function () {
      await this.erc721Instance.mintCommon(this.receiver.address, templateId);
      const value = await this.erc721Instance.getRecordFieldValue(
        tokenId,
        utils.keccak256(ethers.utils.toUtf8Bytes("grade")),
      );
      expect(value).to.equal(1);
    });

    it("should fail: field not found", async function () {
      await this.erc721Instance.mintCommon(this.receiver.address, templateId);
      const value = this.erc721Instance.getRecordFieldValue(
        tokenId,
        utils.keccak256(ethers.utils.toUtf8Bytes("non-existing-field")),
      );
      await expect(value).to.be.revertedWith("GC: field not found");
    });
  });

  describe("upgrade", function () {
    it("should level up", async function () {
      await this.erc721Instance.mintCommon(this.receiver.address, templateId);

      const tx1 = this.erc721Instance.upgrade(tokenId);
      await expect(tx1).to.not.be.reverted;

      const value2 = await this.erc721Instance.getRecordFieldValue(
        tokenId,
        utils.keccak256(ethers.utils.toUtf8Bytes("grade")),
      );
      expect(value2).to.equal(2);
    });

    it("should fail: insufficient permissions", async function () {
      await this.erc721Instance.mintCommon(this.receiver.address, templateId);

      const tx1 = this.erc721Instance.connect(this.receiver).upgrade(tokenId);
      await expect(tx1).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });
  });
});
