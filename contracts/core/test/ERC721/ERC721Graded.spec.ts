import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

import { ERC721Graded, ERC721NonReceiverMock, ERC721ReceiverMock } from "../../typechain-types";
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

describe("ERC721Graded", function () {
  let erc721Instance: ERC721Graded;
  let erc721ReceiverInstance: ERC721ReceiverMock;
  let erc721NonReceiverInstance: ERC721NonReceiverMock;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721Graded");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, baseTokenURI, royalty);
    const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
    erc721ReceiverInstance = await erc721ReceiverFactory.deploy();
    const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
    erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

    await erc721Instance.setMaxTemplateId(templateId);

    this.contractInstance = erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const tx = erc721Instance.mintCommon(this.receiver.address, templateId);
      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const balance = await erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);

      const value = await erc721Instance.getRecordFieldValue(
        tokenId,
        utils.keccak256(ethers.utils.toUtf8Bytes("templateId")),
      );
      expect(value).to.equal(templateId);
    });

    it("should mint to receiver", async function () {
      const tx = erc721Instance.mintCommon(erc721ReceiverInstance.address, templateId);
      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, erc721ReceiverInstance.address, tokenId);

      const balance = await erc721Instance.balanceOf(erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });

    it("should fail: wrong role", async function () {
      const tx = erc721Instance.connect(this.receiver).mintCommon(this.receiver.address, templateId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should fail: to mint to non receiver", async function () {
      const tx = erc721Instance.mintCommon(erc721NonReceiverInstance.address, templateId);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });
});
