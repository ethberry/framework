import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { AirdropERC721, Item } from "../../typechain-types";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  royaltyNumerator,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";

describe("AirdropERC721", function () {
  let item: ContractFactory;
  let itemInstance: Item;
  let airdrop: ContractFactory;
  let airdropInstance: AirdropERC721;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let network: Network;

  beforeEach(async function () {
    airdrop = await ethers.getContractFactory("AirdropERC721");
    item = await ethers.getContractFactory("Item");
    [owner, receiver] = await ethers.getSigners();

    itemInstance = (await item.deploy(tokenName, tokenSymbol, baseTokenURI, royaltyNumerator)) as Item;

    airdropInstance = (await airdrop.deploy(
      tokenName,
      tokenSymbol,
      baseTokenURI,
      1,
      royaltyNumerator,
    )) as AirdropERC721;
    await airdropInstance.setFactory(itemInstance.address);

    network = await ethers.provider.getNetwork();
  });

  describe("hasRole", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await itemInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await itemInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  describe("redeem", function () {
    it("should redeem", async function () {
      const signature = await owner._signTypedData(
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
            { name: "account", type: "address" },
            { name: "airdropId", type: "uint256" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          account: receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = airdropInstance
        .connect(receiver)
        .redeem(receiver.address, tokenId, templateId, owner.address, signature);
      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(receiver.address, airdropInstance.address, tokenId, templateId, 0);

      const ownerOf = await airdropInstance.ownerOf(tokenId);
      expect(ownerOf).to.equal(receiver.address);
    });

    it("should fail: wrong signer", async function () {
      const signature = await owner._signTypedData(
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
            { name: "account", type: "address" },
            { name: "airdropId", type: "uint256" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          account: receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = airdropInstance
        .connect(receiver)
        .redeem(receiver.address, tokenId, templateId, receiver.address, signature);
      await expect(tx1).to.be.revertedWith("AirdropERC721: Wrong signer");
    });

    it("should fail: invalid signature", async function () {
      const tx1 = airdropInstance
        .connect(receiver)
        .redeem(receiver.address, tokenId, templateId, owner.address, ethers.utils.formatBytes32String("signature"));
      await expect(tx1).to.be.revertedWith("AirdropERC721: Invalid signature");
    });

    it("should fail: token already minted", async function () {
      const signature = await owner._signTypedData(
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
            { name: "account", type: "address" },
            { name: "airdropId", type: "uint256" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          account: receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = airdropInstance
        .connect(receiver)
        .redeem(receiver.address, tokenId, templateId, owner.address, signature);
      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(receiver.address, airdropInstance.address, tokenId, templateId, 0);

      const tx2 = airdropInstance
        .connect(receiver)
        .redeem(receiver.address, tokenId, templateId, owner.address, signature);
      await expect(tx2).to.be.revertedWith("ERC721: token already minted");
    });

    it("should fail: cap exceeded", async function () {
      const signature = await owner._signTypedData(
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
            { name: "account", type: "address" },
            { name: "airdropId", type: "uint256" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          account: receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = airdropInstance
        .connect(receiver)
        .redeem(receiver.address, tokenId, templateId, owner.address, signature);
      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(receiver.address, airdropInstance.address, tokenId, templateId, 0);

      const airdropId = 2;

      const signature2 = await owner._signTypedData(
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
            { name: "account", type: "address" },
            { name: "airdropId", type: "uint256" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          account: receiver.address,
          airdropId,
          templateId,
        },
      );

      const tx2 = airdropInstance
        .connect(receiver)
        .redeem(receiver.address, airdropId, templateId, owner.address, signature2);
      await expect(tx2).to.be.revertedWith("ERC721Capped: cap exceeded");
    });
  });
});
