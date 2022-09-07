import { ethers } from "hardhat";
import { expect } from "chai";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldHaveRole } from "../ERC721/shared/accessControl/hasRoles";
import { shouldMint } from "../ERC721/shared/mint";
import { shouldSafeMint } from "../ERC721/shared/safeMint";
import { deployErc721Fixture } from "../ERC721/shared/fixture";

describe("ERC998Genes", function () {
  const name = "ERC998Genes";

  shouldHaveRole(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldMint(name);
  shouldSafeMint(name);

  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      const tx = contractInstance.connect(receiver).mint(receiver.address);
      await expect(tx).to.be.revertedWith("MethodNotSupported");
    });
  });
});
