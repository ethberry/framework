import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC721Airdrop, ERC721Simple } from "../../typechain-types";
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
  let erc721Instance: ERC721Simple;
  let airdropInstance: ERC721Airdrop;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, baseTokenURI, royalty);
    const airdropFactory = await ethers.getContractFactory("ERC721Airdrop");
    airdropInstance = await airdropFactory.deploy(tokenName, tokenSymbol, baseTokenURI, 1, royalty);

    await airdropInstance.setFactory(erc721Instance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = airdropInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  describe("redeem", function () {
    it("should redeem", async function () {
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

      const tx1 = airdropInstance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.owner.address, signature);
      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, airdropInstance.address, tokenId, templateId, 0);

      const ownerOf = await airdropInstance.ownerOf(tokenId);
      expect(ownerOf).to.equal(this.receiver.address);
    });

    it("should fail: wrong signer", async function () {
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

      const tx1 = airdropInstance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.receiver.address, signature);
      await expect(tx1).to.be.revertedWith("ERC721Airdrop: Wrong signer");
    });

    it("should fail: invalid signature", async function () {
      const tx1 = airdropInstance
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
          account: this.receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = airdropInstance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.owner.address, signature);
      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, airdropInstance.address, tokenId, templateId, 0);

      const tx2 = airdropInstance
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
          account: this.receiver.address,
          airdropId: tokenId,
          templateId,
        },
      );

      const tx1 = airdropInstance
        .connect(this.receiver)
        .redeem(this.receiver.address, tokenId, templateId, this.owner.address, signature);
      await expect(tx1)
        .to.emit(airdropInstance, "RedeemAirdrop")
        .withArgs(this.receiver.address, airdropInstance.address, tokenId, templateId, 0);

      const airdropId = 2;

      const signature2 = await this.owner._signTypedData(
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
          account: this.receiver.address,
          airdropId,
          templateId,
        },
      );

      const tx2 = airdropInstance
        .connect(this.receiver)
        .redeem(this.receiver.address, airdropId, templateId, this.owner.address, signature2);
      await expect(tx2).to.be.revertedWith("ERC721Capped: cap exceeded");
    });
  });
});
