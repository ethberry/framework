import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { Airdrop, ERC1155Simple, ERC721Simple } from "../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  PAUSER_ROLE,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
  nonce,
} from "../constants";
import { shouldHaveRole } from "../shared/AccessControl/hasRoles";

describe("Airdrop", function () {
  let airdropInstance: Airdrop;
  let erc1155Instance: ERC1155Simple;
  let erc721Instance: ERC721Simple;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    const airdropFactory = await ethers.getContractFactory("Airdrop");
    airdropInstance = await airdropFactory.deploy(tokenName, tokenSymbol, amount, royalty, baseTokenURI);

    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy(baseTokenURI);
    await erc1155Instance.grantRole(MINTER_ROLE, airdropInstance.address);

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721Instance.grantRole(MINTER_ROLE, airdropInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = airdropInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("redeem", function () {
    it("should redeem ERC721", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: airdropInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        },
      );

      const tx1 = airdropInstance.connect(this.receiver).redeem(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount: 1,
        },
        this.owner.address,
        signature,
      );

      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, 1, [2, erc721Instance.address, tokenId, 1]);
    });

    it("should redeem ERC1155", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: airdropInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          item: {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        },
      );

      const tx1 = airdropInstance.connect(this.receiver).redeem(
        nonce,
        {
          tokenType: 4,
          token: erc1155Instance.address,
          tokenId,
          amount,
        },
        this.owner.address,
        signature,
      );

      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, 1, [4, erc1155Instance.address, tokenId, amount]);
    });

    // not an owner
    it("should fail: Invalid signature", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: airdropInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        },
      );

      const tx1 = airdropInstance.connect(this.stranger).redeem(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount: 1,
        },
        this.owner.address,
        signature,
      );

      await expect(tx1).to.be.revertedWith(`Airdrop: Invalid signature`);
    });

    // double redeem
    it("should fail: Expired signature", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: airdropInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        },
      );

      const tx1 = airdropInstance.connect(this.receiver).redeem(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount: 1,
        },
        this.owner.address,
        signature,
      );

      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, 1, [2, erc721Instance.address, tokenId, 1]);

      const tx2 = airdropInstance.connect(this.receiver).redeem(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount: 1,
        },
        this.owner.address,
        signature,
      );

      await expect(tx2).to.be.revertedWith(`Airdrop: Expired signature`);
    });
  });

  describe("unpack ERC721", function () {
    it("should unpack (owner)", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: airdropInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        },
      );

      const tx1 = airdropInstance.connect(this.receiver).redeem(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount: 1,
        },
        this.owner.address,
        signature,
      );

      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, 1, [2, erc721Instance.address, tokenId, 1]);

      const tx2 = airdropInstance.connect(this.receiver).unpack(tokenId);

      await expect(tx2)
        .to.emit(airdropInstance, "UnpackAirdrop")
        .withArgs(tokenId, [2, erc721Instance.address, tokenId, 1]);
    });

    it("should unpack (approved)", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: airdropInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        },
      );

      const tx1 = airdropInstance.connect(this.receiver).redeem(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount: 1,
        },
        this.owner.address,
        signature,
      );

      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, 1, [2, erc721Instance.address, tokenId, 1]);

      const tx2 = airdropInstance.connect(this.receiver).approve(this.stranger.address, tokenId);
      await expect(tx2)
        .to.emit(airdropInstance, "Approval")
        .withArgs(this.receiver.address, this.stranger.address, tokenId);

      const tx3 = airdropInstance.connect(this.stranger).unpack(tokenId);

      await expect(tx3)
        .to.emit(airdropInstance, "UnpackAirdrop")
        .withArgs(tokenId, [2, erc721Instance.address, tokenId, 1]);
    });

    it("should fail: caller is not token owner nor approved", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: airdropInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        },
      );

      const tx1 = airdropInstance.connect(this.receiver).redeem(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount: 1,
        },
        this.owner.address,
        signature,
      );

      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, 1, [2, erc721Instance.address, tokenId, 1]);

      const tx2 = airdropInstance.connect(this.stranger).unpack(tokenId);

      await expect(tx2).to.be.revertedWith(`Airdrop: caller is not token owner nor approved`);
    });

    it("should fail: invalid token ID", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: airdropInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        },
      );

      const tx1 = airdropInstance.connect(this.receiver).redeem(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount: 1,
        },
        this.owner.address,
        signature,
      );

      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, 1, [2, erc721Instance.address, tokenId, 1]);

      const tx2 = airdropInstance.connect(this.receiver).unpack(tokenId);

      await expect(tx2)
        .to.emit(airdropInstance, "UnpackAirdrop")
        .withArgs(tokenId, [2, erc721Instance.address, tokenId, 1]);

      const tx3 = airdropInstance.connect(this.receiver).unpack(tokenId);

      await expect(tx3).to.be.revertedWith(`ERC721: invalid token ID`);
    });
  });
});
