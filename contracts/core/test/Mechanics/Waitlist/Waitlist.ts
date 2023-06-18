import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, nonce } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";
import { deployContract } from "@gemunion/contracts-mocks";

import { deployERC721 } from "../../ERC721/shared/fixtures";
import { expiresAt, externalId, tokenId } from "../../constants";
import { isEqualEventArgArrObj } from "../../utils";

describe("WaitList", function () {
  const factory = () => deployContract(this.title);
  const erc721factory = () => deployERC721();

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);
  shouldBehaveLikePausable(factory);

  describe("setReward", function () {
    it("should set reward", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: ZeroAddress,
        extra: merkleTree.root,
      };

      const tx = contractInstance.setReward(params, items);
      await expect(tx)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(isEqualEventArgArrObj(params), isEqualEventArgArrObj(...items));
    });

    it("should fail: account is missing role", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: ZeroAddress,
        extra: merkleTree.root,
      };

      const tx = contractInstance.connect(receiver).setReward(params, []);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should fail: WrongAmount", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: ZeroAddress,
        extra: merkleTree.root,
      };

      const tx = contractInstance.setReward(params, []);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "WrongAmount");
    });

    it("should fail: AlreadyExist", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: ZeroAddress,
        extra: merkleTree.root,
      };

      const tx = contractInstance.setReward(params, items);
      await expect(tx)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(isEqualEventArgArrObj(params), isEqualEventArgArrObj(...items));

      const tx2 = contractInstance.setReward(params, items);
      await expect(tx2).to.be.revertedWithCustomError(contractInstance, "AlreadyExist");
    });
  });

  describe("claimReward", function () {
    it("should claim reward", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: ZeroAddress,
        extra: merkleTree.root,
      };

      const tx1 = contractInstance.setReward(params, items);
      await expect(tx1)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(isEqualEventArgArrObj(params), isEqualEventArgArrObj(...items));

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx2 = contractInstance.claim(proof, externalId);
      await expect(tx2)
        .to.emit(contractInstance, "WaitListRewardClaimed")
        .withArgs(owner.address, externalId, isEqualEventArgArrObj(...items));
    });

    it("should claim reward as receiver", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: ZeroAddress,
        extra: merkleTree.root,
      };

      const tx1 = contractInstance.setReward(params, items);
      await expect(tx1)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(isEqualEventArgArrObj(params), isEqualEventArgArrObj(...items));

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === receiver.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx2 = contractInstance.connect(receiver).claim(proof, externalId);
      await expect(tx2)
        .to.emit(contractInstance, "WaitListRewardClaimed")
        .withArgs(receiver.address, externalId, isEqualEventArgArrObj(...items));
    });

    it("should fail: pause", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      await contractInstance.pause();
      const tx1 = contractInstance.claim(proof, externalId);
      await expect(tx1).to.be.revertedWith("Pausable: paused");
    });

    it("should fail: Not yet started", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx1 = contractInstance.claim(proof, externalId);
      await expect(tx1).to.be.rejectedWith("Waitlist: Not yet started");
    });

    it("should fail: sender is not in the wait list", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: ZeroAddress,
        extra: merkleTree.root,
      };

      const tx1 = contractInstance.setReward(params, items);
      await expect(tx1)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(isEqualEventArgArrObj(params), isEqualEventArgArrObj(...items));

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx2 = contractInstance.connect(receiver).claim(proof, externalId);
      await expect(tx2).to.be.revertedWith("Waitlist: You are not in the wait list");
    });

    it("should fail: Reward already claimed", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], [stranger.address]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: ZeroAddress,
        extra: merkleTree.root,
      };

      const tx1 = contractInstance.setReward(params, items);
      await expect(tx1)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(isEqualEventArgArrObj(params), isEqualEventArgArrObj(...items));

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx2 = contractInstance.claim(proof, externalId);
      await expect(tx2).to.emit(contractInstance, "WaitListRewardClaimed");

      const tx3 = contractInstance.claim(proof, externalId);
      await expect(tx3).to.be.rejectedWith("Witlist: Reward already claimed");
    });
  });
});
