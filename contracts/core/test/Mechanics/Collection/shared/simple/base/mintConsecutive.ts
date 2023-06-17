import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { batchSize } from "@gemunion/contracts-constants";

import { tokenId } from "../../../../../constants";

export function shouldMintConsecutive(factory: () => Promise<any>) {
  describe("mintConsecutive", function () {
    it("should fail: token already minted", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx1 = contractInstance.mintConsecutive(receiver.address, batchSize + tokenId);
      await expect(tx1)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, receiver.address, batchSize + tokenId);

      const tx2 = contractInstance.mintConsecutive(receiver.address, batchSize + tokenId);
      await expect(tx2).to.be.revertedWith("ERC721: token already minted");
    });
  });
}
