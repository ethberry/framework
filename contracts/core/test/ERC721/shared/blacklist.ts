import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, templateId } from "../../constants";
import { deployErc721Fixture } from "./fixture";

export function shouldBlacklist(name: string) {
  describe("Black list", function () {
    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      const tx = contractInstance.connect(receiver).blacklist(receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should add to black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      const tx = contractInstance.blacklist(receiver.address);
      await expect(tx).to.emit(contractInstance, "Blacklisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(true);
    });

    it("should delete from black list", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.unBlacklist(receiver.address);
      await expect(tx).to.emit(contractInstance, "UnBlacklisted").withArgs(receiver.address);
      const isBlackListed = await contractInstance.isBlacklisted(receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should fail: blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.mintCommon(receiver.address, templateId);
      await expect(tx).to.be.revertedWith(`Blacklist: receiver is blacklisted`);
    });
  });
}
