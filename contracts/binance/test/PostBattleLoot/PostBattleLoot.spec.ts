import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { PostBattleLoot, Resources } from "../../typechain-types";
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

describe("PostBattleLoot", function () {
  let pbl: ContractFactory;
  let pblInstance: PostBattleLoot;
  let resources: ContractFactory;
  let resourcesInstance: Resources;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let _stranger: SignerWithAddress;
  let network: Network;

  beforeEach(async function () {
    pbl = await ethers.getContractFactory("PostBattleLoot");
    resources = await ethers.getContractFactory("Resources");

    [owner, receiver, _stranger] = await ethers.getSigners();

    pblInstance = (await pbl.deploy(tokenName)) as PostBattleLoot;

    resourcesInstance = (await resources.deploy(baseTokenURI)) as Resources;
    await resourcesInstance.grantRole(MINTER_ROLE, pblInstance.address);

    network = await ethers.provider.getNetwork();
  });

  describe("constructor", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await pblInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isPauser = await pblInstance.hasRole(PAUSER_ROLE, owner.address);
      expect(isPauser).to.equal(true);
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
          account: receiver.address,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx = pblInstance
        .connect(receiver)
        .redeem(nonce, receiver.address, resourcesInstance.address, [tokenId], [amount], owner.address, signature);
      await expect(tx)
        .to.emit(resourcesInstance, "TransferBatch")
        .withArgs(pblInstance.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);
    });

    it("should fail: duplicate mint", async function () {
      const signature = await owner._signTypedData(
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
          account: receiver.address,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx = pblInstance
        .connect(receiver)
        .redeem(nonce, receiver.address, resourcesInstance.address, [tokenId], [amount], owner.address, signature);
      await expect(tx)
        .to.emit(resourcesInstance, "TransferBatch")
        .withArgs(pblInstance.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);

      const tx2 = pblInstance
        .connect(receiver)
        .redeem(nonce, receiver.address, resourcesInstance.address, [tokenId], [amount], owner.address, signature);
      await expect(tx2).to.be.revertedWith("PostBattleLoot: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const signature = await owner._signTypedData(
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
          account: receiver.address,
          collection: resourcesInstance.address,
          tokenIds: [tokenId],
          amounts: [amount],
        },
      );

      const tx = pblInstance
        .connect(receiver)
        .redeem(nonce, receiver.address, resourcesInstance.address, [tokenId], [amount], receiver.address, signature);
      await expect(tx).to.be.revertedWith(`PostBattleLoot: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const tx = pblInstance.redeem(
        nonce,
        receiver.address,
        resourcesInstance.address,
        [tokenId],
        [amount],
        owner.address,
        ethers.utils.formatBytes32String("signature"),
      );
      await expect(tx).to.be.revertedWith(`PostBattleLoot: Invalid signature`);
    });
  });
});
