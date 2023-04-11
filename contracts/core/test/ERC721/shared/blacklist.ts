import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldBehaveLikeERC721BlackList(factory: () => Promise<Contract>) {
  describe("Black list", function () {
    it("shoud fail: sender is blacklisted", async function () {
      const [_owner, recever] = await ethers.getSigners();

      const contractInstance = await factory();
      await contractInstance.mintCommon(recever.address, 1);

      await contractInstance.blacklist(recever.address);

      const tx = contractInstance
        .connect(recever)
        ["safeTransferFrom(address,address,uint256)"](recever.address, _owner.address, 1);

      await expect(tx).to.be.rejectedWith("Blacklist: sender is blacklisted");
    });

    it("shoud fail: receiver is blacklisted", async function () {
      const [owner, recever] = await ethers.getSigners();

      const contractInstance = await factory();
      await contractInstance.mintCommon(owner.address, 1);

      await contractInstance.blacklist(recever.address);

      const tx = contractInstance["safeTransferFrom(address,address,uint256)"](owner.address, recever.address, 1);

      await expect(tx).to.be.rejectedWith("Blacklist: receiver is blacklisted");
    });
  });
}
