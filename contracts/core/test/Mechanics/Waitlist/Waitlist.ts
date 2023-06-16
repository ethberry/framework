import { expect } from "chai";
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";
import { deployContract } from "@gemunion/contracts-mocks";

import { deployERC721 } from "../../ERC721/shared/fixtures";
import { tokenId } from "../../constants";
import { isEqualEventArgArrObj } from "../../utils";
import { deployERC1363 } from "../../ERC20/shared/fixtures";

describe("WaitList", function () {
  const factory = () => deployContract(this.title);
  const erc721factory = () => deployERC721();
  const erc20Factory = () => deployERC1363();

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);
  shouldBehaveLikePausable(factory);

  describe("setReward", function () {
    it("should fail: wrongRole", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.connect(receiver).setReward(root, [], 123);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should set reward", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 0n,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.setReward(root, items, 123);
      await expect(tx)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(123, isEqualEventArgArrObj(...items));
    });

    it("should fail: Reward already set", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 0n,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.setReward(root, items, 123);
      await expect(tx)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(123, isEqualEventArgArrObj(...items));

      const tx2 = contractInstance.setReward(root, items, 123);
      await expect(tx2).to.be.rejectedWith("Waitlist: Reward already set");
    });
  });

  describe("updateReward", function () {
    it("should fail: wrongRole", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.connect(receiver).updateReward(root, [], 123);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should fail: Reward not yet set", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 0,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.updateReward(root, items, 123);
      await expect(tx).to.be.rejectedWith("Waitlist: Reward not yet set");
    });

    it("should update reward", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();
      const erc20Instance = await erc20Factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 0n,
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.setReward(root, items, 123);
      await expect(tx)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(123, isEqualEventArgArrObj(...items));

      const items2 = [
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 0n,
          amount,
        },
      ];

      const tx2 = contractInstance.updateReward(root, items2, 123);
      await expect(tx2)
        .to.emit(contractInstance, "WaitListRewardSet")
        .withArgs(123, isEqualEventArgArrObj(...items2));
    });
  });

  describe("claimReward", function () {
    it("should fail: pause", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      await contractInstance.pause();
      const tx1 = contractInstance.claim(proof, 123);
      await expect(tx1).to.be.revertedWith("Pausable: paused");
    });

    it("should fail: Not yet started", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx1 = contractInstance.claim(proof, 123);
      await expect(tx1).to.be.rejectedWith("Waitlist: Not yet started");
    });

    it("should claim reward", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: "0",
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.setReward(root, items, 123);
      await expect(tx).to.emit(contractInstance, "WaitListRewardSet");

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx1 = contractInstance.claim(proof, 123);
      await expect(tx1).to.emit(contractInstance, "WaitListRewardClaimed");
    });

    it("should claim reward as receiver", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: "0",
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.setReward(root, items, 123);
      await expect(tx).to.emit(contractInstance, "WaitListRewardSet");

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === receiver.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx1 = contractInstance.connect(receiver).claim(proof, 123);
      await expect(tx1).to.emit(contractInstance, "WaitListRewardClaimed");
    });

    it("should fail: sender is not in the wait list", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: "0",
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.setReward(root, items, 123);
      await expect(tx).to.emit(contractInstance, "WaitListRewardSet");

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx1 = contractInstance.connect(receiver).claim(proof, 123);
      await expect(tx1).to.be.revertedWith("Waitlist: You are not in the wait list");
    });

    it("should fail: Reward already claimed", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc721Instance = await erc721factory();

      await erc721Instance.grantRole(MINTER_ROLE, await contractInstance.getAddress());

      const items = [
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: "0",
        },
      ];

      const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

      const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

      const root = merkleTree.root;

      const tx = contractInstance.setReward(root, items, 123);
      await expect(tx).to.emit(contractInstance, "WaitListRewardSet");

      let proof: Array<string> = [];
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === owner.address) {
          // (3)
          proof = merkleTree.getProof(i);
        }
      }
      const tx1 = contractInstance.claim(proof, 123);
      await expect(tx1).to.emit(contractInstance, "WaitListRewardClaimed");

      const tx2 = contractInstance.claim(proof, 123);
      await expect(tx2).to.be.rejectedWith("Witlist: Reward already claimed");
    });
  });
});
