import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenId } from "../constants";

import { shouldHaveRole } from "./shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "./shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "./shared/accessControl/grantRole";
import { shouldRevokeRole } from "./shared/accessControl/revokeRole";
import { shouldRenounceRole } from "./shared/accessControl/renounceRole";
import { deployErc1155Fixture } from "./shared/fixture";

describe("ERC1155Simple", function () {
  const name = "ERC1155Simple";

  shouldHaveRole(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole(name);
  shouldRevokeRole(name);
  shouldRenounceRole(name);

  describe("mintBatch", function () {
    it("should fail for wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Fixture(name);

      const tx = contractInstance.connect(receiver).mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Fixture(name);

      const tx = contractInstance.mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(owner.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);

      const balance = await contractInstance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const totalSupply = await contractInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });
  });
});
