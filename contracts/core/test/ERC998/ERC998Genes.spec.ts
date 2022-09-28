import { ethers } from "hardhat";
import { expect } from "chai";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldMint } from "../ERC721/shared/simple/base/mint";
import { shouldSafeMint } from "../ERC721/shared/simple/base/safeMint";
import { deployErc721Base } from "../ERC721/shared/fixtures";
import { shouldERC721Accessible } from "../ERC721/shared/accessible";

describe("ERC998Genes", function () {
  const name = "ERC998Genes";

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
