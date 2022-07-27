import { expect } from "chai";
import { ethers } from "hardhat";

import { ERC1155Simple } from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty, tokenId } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("ERC1155Simple", function () {
  let erc1155Instance: ERC1155Simple;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

    this.contractInstance = erc1155Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  describe("mintBatch", function () {
    it("should fail for wrong role", async function () {
      const tx = erc1155Instance.connect(this.receiver).mintBatch(this.receiver.address, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint", async function () {
      const tx = erc1155Instance.mintBatch(this.receiver.address, [tokenId], [amount], "0x");
      await expect(tx)
        .to.emit(erc1155Instance, "TransferBatch")
        .withArgs(this.owner.address, ethers.constants.AddressZero, this.receiver.address, [tokenId], [amount]);

      const balance = await erc1155Instance.balanceOf(this.receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const totalSupply = await erc1155Instance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });
  });
});
