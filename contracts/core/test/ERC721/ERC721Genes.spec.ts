import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC721 } from "./shared/fixtures";
import { shouldMint } from "./shared/simple/base/mint";
import { shouldSafeMint } from "./shared/simple/base/safeMint";

describe("ERC721Genes", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldMint(factory);
  shouldSafeMint(factory);

  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).mint(receiver.address);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "MethodNotSupported");
    });
  });

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721);
});
