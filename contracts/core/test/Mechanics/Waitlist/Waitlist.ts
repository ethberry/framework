import { expect } from "chai";
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import { ERC721Simple, Waitlist } from "../../../typechain-types";
import { baseTokenURI, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../../constants";

describe("Waitlist", function () {
  let waitlistInstance: Waitlist;
  let erc721Instance: ERC721Simple;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const waitlistFactory = await ethers.getContractFactory("Waitlist");
    waitlistInstance = await waitlistFactory.deploy();

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    await erc721Instance.grantRole(MINTER_ROLE, waitlistInstance.address);
  });

  it("should set & claim reward", async function () {
    const items = [
      {
        tokenType: 2,
        token: erc721Instance.address,
        tokenId: 101001,
        amount: "0",
      },
    ];

    const leavesEntities = [
      [this.owner.address],
      [this.receiver.address],
      ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"],
    ];

    const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

    const root = merkleTree.root;

    const tx = waitlistInstance.setReward(root, items, 123);
    await expect(tx).to.emit(waitlistInstance, "RewardSet");

    let proof: Array<string> = [];
    for (const [i, v] of merkleTree.entries()) {
      if (v[0] === this.owner.address) {
        // (3)
        proof = merkleTree.getProof(i);
      }
    }
    const tx1 = waitlistInstance.claim(proof, 123);
    await expect(tx1).to.emit(waitlistInstance, "ClaimReward");
  });
});
