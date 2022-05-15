import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
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
  let marketplace: ContractFactory;
  let marketplaceInstance: ERC721Marketplace;
  let item: ContractFactory;
  let itemInstance: ERC721Simple;
  let dropbox: ContractFactory;
  let dropboxInstance: ERC721Dropbox;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    marketplace = await ethers.getContractFactory("ERC721Marketplace");
    marketplaceInstance = (await marketplace.deploy(tokenName)) as ERC721Marketplace;

    item = await ethers.getContractFactory("ERC721Simple");
    itemInstance = (await item.deploy(tokenName, tokenSymbol, baseTokenURI, royalty)) as ERC721Simple;
    dropbox = await ethers.getContractFactory("ERC721Dropbox");
    dropboxInstance = (await dropbox.deploy(tokenName, tokenSymbol, baseTokenURI, royalty)) as ERC721Dropbox;

    await itemInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);
    await dropboxInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = marketplaceInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("buyCommon", function () {
    it("should buy common item", async function () {
      // await itemInstance.setMaxTemplateId(2);

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
      // await itemInstance.setMaxTemplateId(2);

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
      // await itemInstance.setMaxTemplateId(2);

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
      // await itemInstance.setMaxTemplateId(2);

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
