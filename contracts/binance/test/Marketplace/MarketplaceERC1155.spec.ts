import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { MarketplaceERC1155, Resources } from "../../typechain-types";
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

describe("MarketplaceERC1155", function () {
  let marketplace: ContractFactory;
  let marketplaceInstance: MarketplaceERC1155;
  let resources: ContractFactory;
  let resourcesInstance: Resources;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let network: Network;

  beforeEach(async function () {
    [owner, receiver] = await ethers.getSigners();

    marketplace = await ethers.getContractFactory("MarketplaceERC1155");
    marketplaceInstance = (await marketplace.deploy(tokenName)) as MarketplaceERC1155;

    resources = await ethers.getContractFactory("Resources");
    resourcesInstance = (await resources.deploy(baseTokenURI)) as Resources;
    await resourcesInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    network = await ethers.provider.getNetwork();
  });

  describe("hasRole", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await marketplaceInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isPauser = await marketplaceInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
      const isMinter = await resourcesInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  describe("buy resources", function () {
    it("should buy resources", async function () {
      const signature = await owner._signTypedData(
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
        .connect(receiver)
        .buyResources(nonce, resourcesInstance.address, [tokenId], [amount], owner.address, signature, {
          value: amount,
        });
      await expect(tx)
        .to.emit(resourcesInstance, "TransferBatch")
        .withArgs(marketplaceInstance.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);
    });

    it("should fail: duplicate mint", async function () {
      const signature = await owner._signTypedData(
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
        .connect(receiver)
        .buyResources(nonce, resourcesInstance.address, [tokenId], [amount], owner.address, signature, {
          value: amount,
        });
      await expect(tx)
        .to.emit(resourcesInstance, "TransferBatch")
        .withArgs(marketplaceInstance.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);

      const tx2 = marketplaceInstance
        .connect(receiver)
        .buyResources(nonce, resourcesInstance.address, [tokenId], [amount], owner.address, signature, {
          value: amount,
        });
      await expect(tx2).to.be.revertedWith("MarketplaceERC1155: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const signature = await owner._signTypedData(
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
        .connect(receiver)
        .buyResources(nonce, resourcesInstance.address, [tokenId], [amount], receiver.address, signature, {
          value: amount,
        });
      await expect(tx).to.be.revertedWith(`MarketplaceERC1155: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const tx = marketplaceInstance.buyResources(
        nonce,
        resourcesInstance.address,
        [tokenId],
        [amount],
        owner.address,
        ethers.utils.formatBytes32String("signature"),
        { value: amount },
      );
      await expect(tx).to.be.revertedWith(`MarketplaceERC1155: Invalid signature`);
    });
  });
});
