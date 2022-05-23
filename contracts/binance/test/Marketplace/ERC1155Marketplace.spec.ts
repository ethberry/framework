import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC1155Marketplace, ERC1155Simple } from "../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
  tokenId,
  tokenName,
} from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("ERC1155Marketplace", function () {
  let marketplaceInstance: ERC1155Marketplace;
  let resourcesInstance: ERC1155Simple;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const marketplaceFactory = await ethers.getContractFactory("ERC1155Marketplace");
    marketplaceInstance = await marketplaceFactory.deploy(tokenName);
    const resourcesFactory = await ethers.getContractFactory("ERC1155Simple");
    resourcesInstance = await resourcesFactory.deploy(baseTokenURI);
    await resourcesInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = marketplaceInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("buy resources", function () {
    it("should buy resources", async function () {
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
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyResources(nonce, resourcesInstance.address, [tokenId], [amount], this.owner.address, signature, {
          value: amount,
        });
      await expect(tx)
        .to.emit(resourcesInstance, "TransferBatch")
        .withArgs(
          marketplaceInstance.address,
          ethers.constants.AddressZero,
          this.receiver.address,
          [tokenId],
          [amount],
        );
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
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyResources(nonce, resourcesInstance.address, [tokenId], [amount], this.owner.address, signature, {
          value: amount,
        });
      await expect(tx)
        .to.emit(resourcesInstance, "TransferBatch")
        .withArgs(
          marketplaceInstance.address,
          ethers.constants.AddressZero,
          this.receiver.address,
          [tokenId],
          [amount],
        );

      const tx2 = marketplaceInstance
        .connect(this.receiver)
        .buyResources(nonce, resourcesInstance.address, [tokenId], [amount], this.owner.address, signature, {
          value: amount,
        });
      await expect(tx2).to.be.revertedWith("ERC1155Marketplace: Expired signature");
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
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
          price: amount,
        },
      );

      const tx = marketplaceInstance
        .connect(this.receiver)
        .buyResources(nonce, resourcesInstance.address, [tokenId], [amount], this.receiver.address, signature, {
          value: amount,
        });
      await expect(tx).to.be.revertedWith(`ERC1155Marketplace: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const tx = marketplaceInstance.buyResources(
        nonce,
        resourcesInstance.address,
        [tokenId],
        [amount],
        this.owner.address,
        ethers.utils.formatBytes32String("signature"),
        { value: amount },
      );
      await expect(tx).to.be.revertedWith(`ERC1155Marketplace: Invalid signature`);
    });
  });
});
