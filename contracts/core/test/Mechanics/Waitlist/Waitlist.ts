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

  it.only("should set reward", async function () {
    const items = [
      {
        tokenType: 2,
        token: "0x5c41079f959127be3b74e4e5cdbc4b5114f2df91",
        tokenId: 301002,
        amount: "0",
      },
    ];

    const leavesEntities = [this.owner.address, this.receiver.address, "0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"];

    // const leaves = leavesEntities.map(x => utils.keccak256(utils.toUtf8Bytes(x)));
    const leaves = leavesEntities.map(x => utils.keccak256(x));
    const merkleTree = new MerkleTree(leaves, utils.keccak256, { hashLeaves: true, sortPairs: true });
    // const rootHex = merkleTree.getHexRoot();
    const root = merkleTree.getHexRoot();
    console.log("root", root);
    const tx = waitlistInstance.setReward(root, items, 123);
    await expect(tx).to.emit(waitlistInstance, "RewardSet");

    const proof = merkleTree.getProof(leaves[0]);
    // console.log("proof-len", proof[0].data.length);
    const proofArr = proof.map(x => x.data);
    // console.log("proofArr", proofArr);
    const verified = merkleTree.verify(proof, leaves[0], root);
    // expect(verified).to.be.equal(true);

    // console.log("leaves[0]", leaves[0]);
    const tx1 = waitlistInstance.testkeccak(proofArr);

    // const proofHex = utils.hexlify(proof);
    // const tx1 = waitlistInstance.claim(proofArr, 123);
    // await expect(tx1).to.emit(waitlistInstance, "ClaimReward");
  });
});
