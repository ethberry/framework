import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { DEFAULT_ADMIN_ROLE, templateId } from "../../constants";

use(solidity);

export function shouldBlacklist() {
  describe("Black list", function () {
    it("should fail: account is missing role", async function () {
      const tx = this.contractInstance.connect(this.receiver).blacklist(this.receiver.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should check black list", async function () {
      const isBlackListed = await this.contractInstance.isBlacklisted(this.receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should add to black list", async function () {
      const tx = this.contractInstance.blacklist(this.receiver.address);
      await expect(tx).to.emit(this.contractInstance, "Blacklisted").withArgs(this.receiver.address);
      const isBlackListed = await this.contractInstance.isBlacklisted(this.receiver.address);
      expect(isBlackListed).to.equal(true);
    });

    it("should delete from black list", async function () {
      await this.contractInstance.blacklist(this.receiver.address);
      const tx = this.contractInstance.unBlacklist(this.receiver.address);
      await expect(tx).to.emit(this.contractInstance, "UnBlacklisted").withArgs(this.receiver.address);
      const isBlackListed = await this.contractInstance.isBlacklisted(this.receiver.address);
      expect(isBlackListed).to.equal(false);
    });

    it("should fail: blacklisted", async function () {
      await this.contractInstance.blacklist(this.receiver.address);
      const tx = this.contractInstance.mintCommon(this.receiver.address, templateId);
      await expect(tx).to.be.revertedWith(`Blacklist: receiver is blacklisted`);
    });
  });
}
