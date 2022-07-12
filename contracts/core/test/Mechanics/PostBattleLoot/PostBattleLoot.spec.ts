import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC1155Simple, PostBattleLoot } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
  tokenId,
  tokenName,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";

describe("PostBattleLoot", function () {
  let pblInstance: PostBattleLoot;
  let resourcesInstance: ERC1155Simple;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const pblFactory = await ethers.getContractFactory("PostBattleLoot");
    pblInstance = await pblFactory.deploy(tokenName);
    const resourcesFactory = await ethers.getContractFactory("ERC1155Simple");
    resourcesInstance = await resourcesFactory.deploy(baseTokenURI);

    await resourcesInstance.grantRole(MINTER_ROLE, pblInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = pblInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("redeem", function () {
    it("should redeem", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: pblInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "collection", type: "address" },
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx = pblInstance
        .connect(this.receiver)
        .redeem(
          nonce,
          this.receiver.address,
          resourcesInstance.address,
          [tokenId],
          [amount],
          this.owner.address,
          signature,
        );
      await expect(tx)
        .to.emit(resourcesInstance, "TransferBatch")
        .withArgs(pblInstance.address, ethers.constants.AddressZero, this.receiver.address, [tokenId], [amount]);
    });

    it("should fail: duplicate mint", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: pblInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "collection", type: "address" },
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx = pblInstance
        .connect(this.receiver)
        .redeem(
          nonce,
          this.receiver.address,
          resourcesInstance.address,
          [tokenId],
          [amount],
          this.owner.address,
          signature,
        );
      await expect(tx)
        .to.emit(resourcesInstance, "TransferBatch")
        .withArgs(pblInstance.address, ethers.constants.AddressZero, this.receiver.address, [tokenId], [amount]);

      const tx2 = pblInstance
        .connect(this.receiver)
        .redeem(
          nonce,
          this.receiver.address,
          resourcesInstance.address,
          [tokenId],
          [amount],
          this.owner.address,
          signature,
        );
      await expect(tx2).to.be.revertedWith("PostBattleLoot: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: pblInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "collection", type: "address" },
            { name: "tokenIds", type: "uint256[]" },
            { name: "amounts", type: "uint256[]" },
          ],
        },
        // Value
        {
          nonce,
          account: this.receiver.address,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx = pblInstance
        .connect(this.receiver)
        .redeem(
          nonce,
          this.receiver.address,
          resourcesInstance.address,
          [tokenId],
          [amount],
          this.receiver.address,
          signature,
        );
      await expect(tx).to.be.revertedWith(`PostBattleLoot: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const tx = pblInstance.redeem(
        nonce,
        this.receiver.address,
        resourcesInstance.address,
        [tokenId],
        [amount],
        this.owner.address,
        ethers.utils.formatBytes32String("signature"),
      );
      await expect(tx).to.be.revertedWith(`PostBattleLoot: Invalid signature`);
    });
  });
});
