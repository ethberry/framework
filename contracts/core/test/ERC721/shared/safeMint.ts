import { expect } from "chai";

export function shouldSafeMint() {
  describe("safeMint", function () {
    it("should fail: MethodNotSupported", async function () {
      const tx = this.erc721Instance.connect(this.receiver).safeMint(this.receiver.address);
      await expect(tx).to.be.revertedWith("MethodNotSupported");
    });
  });
}
