import { ethers } from "hardhat";
import { expect } from "chai";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  fakeAsset,
  MINTER_ROLE,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";
import { shouldHaveRole } from "../shared/AccessControl/hasRoles";
import { shouldGetTokenURI } from "./shared/tokenURI";
import { shouldSetBaseURI } from "./shared/setBaseURI";

describe("ERC721Simple", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
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

  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const tx = this.erc721Instance.mintCommon(this.receiver.address, fakeAsset);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const balance = await this.erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint to receiver", async function () {
      const tx = this.erc721Instance.mintCommon(this.erc721ReceiverInstance.address, fakeAsset);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.erc721ReceiverInstance.address, tokenId);

      const balance = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });

    it("should fail: wrong role", async function () {
      const tx = this.erc721Instance.connect(this.receiver).mintCommon(this.receiver.address, fakeAsset);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should fail: to mint to non receiver", async function () {
      const tx = this.erc721Instance.mintCommon(this.erc721NonReceiverInstance.address, fakeAsset);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });
});
