import { expect } from "chai";
import { constants } from "ethers";

export function shouldReceive() {
  describe("cap", function () {
    it("should fail: no reason", async function () {
      const tx = this.owner.sendTransaction({
        to: this.contractInstance.address,
        value: constants.WeiPerEther,
        gasLimit: 21000 + 61, // + revert
      });

      await expect(tx).to.be.reverted;
    });
  });
}
