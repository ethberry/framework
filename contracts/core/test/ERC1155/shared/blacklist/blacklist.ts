import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenId } from "../../../constants";

export function shouldBehaveLikeERC1155BlackList(factory: () => Promise<Contract>) {
  describe("Black list", function () {
    it("should fail: blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.mint(receiver.address, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWith(`Blacklist: receiver is blacklisted`);
    });
  });
}
