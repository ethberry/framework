import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

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

describe("ERC721Airdrop", function () {
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721ContentFactory = await ethers.getContractFactory("ERC721Simple");
    this.erc721ContentInstance = await erc721ContentFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    const erc721Factory = await ethers.getContractFactory("ERC721Airdrop");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, 1, royalty, baseTokenURI);

    await this.erc721Instance.setFactory(this.erc721ContentInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  // commented out because it has no mintCommon function, instead it has redeem
  // shouldGetTokenURI();
  // shouldSetBaseURI();

  describe("redeem", function () {
    it("should redeem", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
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
          account: this.receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.owner.address, signature);
      await expect(tx1)
        .to.emit(this.erc721Instance, "RedeemAirdrop")
        .withArgs(this.receiver.address, this.erc721Instance.address, tokenId, templateId, 0);

      const ownerOf = await this.erc721Instance.ownerOf(tokenId);
      expect(ownerOf).to.equal(this.receiver.address);
    });

    it("should fail: wrong signer", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
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
          account: this.receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.receiver.address, signature);
      await expect(tx1).to.be.revertedWith("ERC721Airdrop: Wrong signer");
    });

    it("should fail: invalid signature", async function () {
      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(
          this.receiver.address,
          tokenId,
          templateId,
          this.owner.address,
          ethers.utils.formatBytes32String("signature"),
        );
      await expect(tx1).to.be.revertedWith("ERC721Airdrop: Invalid signature");
    });

    it("should fail: token already minted", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
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
          account: this.receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.owner.address, signature);
      await expect(tx1)
        .to.emit(this.erc721Instance, "RedeemAirdrop")
        .withArgs(this.receiver.address, this.erc721Instance.address, tokenId, templateId, 0);

      const tx2 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.owner.address, signature);
      await expect(tx2).to.be.revertedWith("ERC721: token already minted");
    });

    it("should fail: cap exceeded", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
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
          account: this.receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.owner.address, signature);
      await expect(tx1)
        .to.emit(this.erc721Instance, "RedeemAirdrop")
        .withArgs(this.receiver.address, this.erc721Instance.address, tokenId, templateId, 0);

      const airdropId = 2;

      const signature2 = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.erc721Instance.address,
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
          account: this.receiver.address,
          airdropId,
          templateId,
        },
      );

      const tx2 = this.erc721Instance
        .connect(this.receiver)
        .redeem(this.receiver.address, airdropId, templateId, this.owner.address, signature2);
      await expect(tx2).to.be.revertedWith("ERC721Capped: cap exceeded");
    });
  });
});
