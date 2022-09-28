import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { deployErc721Base } from "./shared/fixtures";
import { shouldERC721Accessible } from "./shared/accessible";
import { shouldSafeMint } from "./shared/simple/base/safeMint";
import { shouldMint } from "./shared/simple/base/mint";

describe("ERC721Genes", function () {
  const name = "ERC721Genes";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldMint(name);
  shouldSafeMint(name);

  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const tx = contractInstance.connect(receiver).mint(receiver.address);
      await expect(tx).to.be.revertedWith("MethodNotSupported");
    });
  });
});
