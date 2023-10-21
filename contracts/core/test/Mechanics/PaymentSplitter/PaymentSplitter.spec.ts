import { expect } from "chai";

import { deployPaymentSplitter } from "./fixture";

describe("deployPaymentSplitter", function () {
  describe("totalShares", function () {
    it("should get total shares", async function () {
      const contractInstance = await deployPaymentSplitter();

      const totalShares = await contractInstance.totalShares();
      expect(totalShares).to.equal(100);
    });
  });
});
