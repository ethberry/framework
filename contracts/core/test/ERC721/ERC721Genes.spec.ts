import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";

import { shouldHaveRole } from "./shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "./shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "./shared/accessControl/grantRole";
import { shouldRevokeRole } from "./shared/accessControl/revokeRole";
import { shouldRenounceRole } from "./shared/accessControl/renounceRole";

import { shouldMint } from "./shared/mint";
import { shouldSafeMint } from "./shared/safeMint";
import { deployErc721Fixture } from "./shared/fixture";

describe("ERC721Genes", function () {
  const name = "ERC721Genes";

  shouldHaveRole(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole(name);
  shouldRevokeRole(name);
  shouldRenounceRole(name);

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
