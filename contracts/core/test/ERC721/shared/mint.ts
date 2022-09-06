import { expect } from "chai";

export function shouldMint() {
  describe("mint", function () {
    it("should fail: MethodNotSupported", async function () {
      const tx = this.erc721Instance.connect(this.receiver).mint(this.receiver.address);
      await expect(tx).to.be.revertedWith("MethodNotSupported");
    });
  });
}
