import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployErc721Base } from "./shared/fixtures";
import { shouldMint } from "./shared/simple/base/mint";
import { shouldSafeMint } from "./shared/simple/base/safeMint";

describe("ERC721Genes", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldMint(factory);
  shouldSafeMint(factory);

  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).mint(receiver.address);
      await expect(tx).to.be.revertedWith("MethodNotSupported");
    });
  });
});
