import { expect } from "chai";

export function shouldMint() {
  describe("mint", function () {
    it("should fail: this method is not supported", async function () {
      const tx = this.erc721Instance.connect(this.receiver).mint(this.receiver.address);
      await expect(tx).to.be.revertedWith("ERC721Simple: this method is not supported");
    });
  });
}
