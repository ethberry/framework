import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";

import { Waitlist } from "../../../typechain-types";

describe("Waitlist", function () {
  const span = 2500;
  let waitlistInstance: Waitlist;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const waitlistFactory = await ethers.getContractFactory("Waitlist");
    waitlistInstance = await waitlistFactory.deploy();
  });

  it("should set & claim reward", async function () {
    const items = [
      {
        tokenType: 2,
        token: "0x5c41079f959127be3b74e4e5cdbc4b5114f2df91",
        tokenId: 301002,
        amount: "0",
      },
    ];

    const leavesEntities = [this.owner.address, this.receiver.address, "0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"];

    const leaves = leavesEntities.sort();
    const merkleTree = new MerkleTree(leaves, utils.keccak256, { hashLeaves: true, sortPairs: true });

    const root = merkleTree.getHexRoot();

    const tx = waitlistInstance.setReward(root, items, 123);
    await expect(tx).to.emit(waitlistInstance, "RewardSet");

    const proof = merkleTree.getHexProof(utils.keccak256(this.owner.address));

    const tx1 = waitlistInstance.claim(proof, 123);
    await expect(tx1).to.emit(waitlistInstance, "ClaimReward");
  });
});
