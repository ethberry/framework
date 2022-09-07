import { expect } from "chai";
import { ethers } from "hardhat";

import { templateId, tokenId } from "../../../constants";
import { deployErc721Fixture } from "../fixture";

export function shouldSetApprovalForAll(name: string) {
  describe("setApprovalForAll", function () {
    it("should approve for all", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.mintCommon(owner.address, templateId);
      await contractInstance.mintCommon(owner.address, templateId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(2);

      const tx1 = contractInstance.setApprovalForAll(receiver.address, true);
      await expect(tx1).to.not.be.reverted;

      const approved1 = await contractInstance.getApproved(tokenId);
      expect(approved1).to.equal(ethers.constants.AddressZero);

      const isApproved1 = await contractInstance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved1).to.equal(true);

      const tx2 = contractInstance.setApprovalForAll(receiver.address, false);
      await expect(tx2).to.not.be.reverted;

      const approved3 = await contractInstance.getApproved(tokenId);
      expect(approved3).to.equal(ethers.constants.AddressZero);

      const isApproved2 = await contractInstance.isApprovedForAll(owner.address, receiver.address);
      expect(isApproved2).to.equal(false);
    });
  });
}
