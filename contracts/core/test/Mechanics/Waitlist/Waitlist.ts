import { expect } from "chai";
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";

import { deployContract } from "../../shared/fixture";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { tokenId } from "../../constants";

describe("Waitlist", function () {
  const factory = () => deployContract(this.title);
  const erc721factory = () => deployERC721();

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  it("should set & claim reward", async function () {
    const [owner, receiver] = await ethers.getSigners();

    const contractInstance = await factory();
    const erc721Instance = await erc721factory();

    await erc721Instance.grantRole(MINTER_ROLE, contractInstance.address);

    const items = [
      {
        tokenType: 2,
        token: erc721Instance.address,
        tokenId,
        amount: "0",
      },
    ];

    const leavesEntities = [[owner.address], [receiver.address], ["0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73"]];

    const merkleTree = StandardMerkleTree.of(leavesEntities, ["address"]);

    const root = merkleTree.root;

    const tx = contractInstance.setReward(root, items, 123);
    await expect(tx).to.emit(contractInstance, "RewardSet");

    let proof: Array<string> = [];
    for (const [i, v] of merkleTree.entries()) {
      if (v[0] === owner.address) {
        // (3)
        proof = merkleTree.getProof(i);
      }
    }
    const tx1 = contractInstance.claim(proof, 123);
    await expect(tx1).to.emit(contractInstance, "ClaimReward");
  });
});
