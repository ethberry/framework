import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC721Dropbox, ERC721Marketplace, ERC721Simple } from "../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
  royalty,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("ERC721Marketplace", function () {
  let marketplaceInstance: ERC721Marketplace;
  let itemInstance: ERC721Simple;
  let dropboxInstance: ERC721Dropbox;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const marketplaceFactory = await ethers.getContractFactory("ERC721Marketplace");
    marketplaceInstance = await marketplaceFactory.deploy(tokenName);
    const itemFactory = await ethers.getContractFactory("ERC721Simple");
    itemInstance = await itemFactory.deploy(tokenName, tokenSymbol, baseTokenURI, royalty);
    const dropboxFactory = await ethers.getContractFactory("ERC721Dropbox");
    dropboxInstance = await dropboxFactory.deploy(tokenName, tokenSymbol, baseTokenURI, royalty);

    await itemInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);
    await dropboxInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);
    // await itemInstance.setMaxTemplateId(tokenId);

    network = await ethers.provider.getNetwork();

    this.contractInstance = marketplaceInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("buyCommon", function () {
    it("should buy common item", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: marketplaceInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "collection", type: "address" },
            { name: "templateId", type: "uint256" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: itemInstance.address,
          templateId,
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyCommon(nonce, itemInstance.address, templateId, this.owner.address, signature, { value: amount });
      await expect(tx)
        .to.emit(itemInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });

    it("should fail: duplicate mint", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: marketplaceInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "collection", type: "address" },
            { name: "templateId", type: "uint256" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: itemInstance.address,
          templateId,
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyCommon(nonce, itemInstance.address, templateId, this.owner.address, signature, { value: amount });
      await expect(tx)
        .to.emit(itemInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const tx2 = marketplaceInstance
        .connect(this.receiver)
        .buyCommon(nonce, itemInstance.address, templateId, this.owner.address, signature, { value: amount });
      await expect(tx2).to.be.revertedWith("ERC721Marketplace: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: marketplaceInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "collection", type: "address" },
            { name: "templateId", type: "uint256" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: itemInstance.address,
          templateId,
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyCommon(nonce, itemInstance.address, templateId, this.receiver.address, signature, { value: amount });
      await expect(tx).to.be.revertedWith(`ERC721Marketplace: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const tx = marketplaceInstance.buyCommon(
        nonce,
        itemInstance.address,
        templateId,
        this.owner.address,
        ethers.utils.formatBytes32String("signature"),
        { value: amount },
      );
      await expect(tx).to.be.revertedWith(`ERC721Marketplace: Invalid signature`);
    });
  });

  describe("buyDropbox", function () {
    it("should buy common item", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: marketplaceInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "collection", type: "address" },
            { name: "templateId", type: "uint256" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: dropboxInstance.address,
          templateId,
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyDropbox(nonce, dropboxInstance.address, templateId, this.owner.address, signature, { value: amount });
      await expect(tx)
        .to.emit(dropboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });

    it("should fail: duplicate mint", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: marketplaceInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "collection", type: "address" },
            { name: "templateId", type: "uint256" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: dropboxInstance.address,
          templateId,
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyDropbox(nonce, dropboxInstance.address, templateId, this.owner.address, signature, { value: amount });
      await expect(tx)
        .to.emit(dropboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const tx2 = marketplaceInstance
        .connect(this.receiver)
        .buyDropbox(nonce, dropboxInstance.address, templateId, this.owner.address, signature, { value: amount });
      await expect(tx2).to.be.revertedWith("ERC721Marketplace: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: marketplaceInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "collection", type: "address" },
            { name: "templateId", type: "uint256" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: dropboxInstance.address,
          templateId,
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyDropbox(nonce, dropboxInstance.address, templateId, this.receiver.address, signature, {
          value: amount,
        });
      await expect(tx).to.be.revertedWith(`ERC721Marketplace: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const tx = marketplaceInstance.buyDropbox(
        nonce,
        dropboxInstance.address,
        templateId,
        this.owner.address,
        ethers.utils.formatBytes32String("signature"),
        { value: amount },
      );
      await expect(tx).to.be.revertedWith(`ERC721Marketplace: Invalid signature`);
    });
  });
});
