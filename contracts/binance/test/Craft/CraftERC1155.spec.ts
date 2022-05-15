import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { CraftERC1155, ERC1155Simple } from "../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, tokenId } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("CraftERC1155", function () {
  let resource: ContractFactory;
  let resourceInstance: ERC1155Simple;
  let refinery: ContractFactory;
  let refineryInstance: CraftERC1155;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    resource = await ethers.getContractFactory("ERC1155Simple");
    resourceInstance = (await resource.deploy(baseTokenURI)) as ERC1155Simple;

    refinery = await ethers.getContractFactory("CraftERC1155");
    refineryInstance = (await refinery.deploy()) as CraftERC1155;

    await resourceInstance.grantRole(MINTER_ROLE, refineryInstance.address);

    await refineryInstance.createRecipe(1, resourceInstance.address, [tokenId], [10], resourceInstance.address, 4);

    this.contractInstance = refineryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("craft", function () {
    it("should craft resources lvl2", async function () {
      await resourceInstance.mint(this.receiver.address, tokenId, 10, "0x");

      await resourceInstance.connect(this.receiver).setApprovalForAll(refineryInstance.address, true);

      const tx1 = refineryInstance.connect(this.receiver).craft(1, 1);
      await expect(tx1)
        .to.emit(resourceInstance, "TransferBatch")
        .withArgs(refineryInstance.address, this.receiver.address, ethers.constants.AddressZero, [tokenId], [10])
        .emit(resourceInstance, "TransferSingle")
        .withArgs(refineryInstance.address, ethers.constants.AddressZero, this.receiver.address, 4, 1);

      const balance = await resourceInstance.balanceOf(this.receiver.address, tokenId);
      expect(balance).to.equal(0);
    });

    it("should fail: insufficient permissions", async function () {
      const tx = refineryInstance.connect(this.receiver).craft(1, 1);
      await expect(tx).revertedWith("ERC1155: caller is not owner nor approved");
    });

    it("should fail: insufficient balance", async function () {
      await resourceInstance.connect(this.receiver).setApprovalForAll(refineryInstance.address, true);

      const tx = refineryInstance.connect(this.receiver).craft(1, 1);
      await expect(tx).revertedWith("ERC1155: burn amount exceeds balance");
    });

    it("should fail: no such recipe", async function () {
      const tx = refineryInstance.connect(this.receiver).craft(2, 1);
      await expect(tx).to.be.revertedWith("CraftERC1155: recipe is not active");
    });

    it("should fail: recipe is not active", async function () {
      await refineryInstance.updateRecipe(1, false);

      const tx = refineryInstance.connect(this.receiver).craft(1, 1);
      await expect(tx).to.be.revertedWith("CraftERC1155: recipe is not active");
    });
  });

  describe("createRecipe", function () {
    it("should create recipe", async function () {
      const tx1 = refineryInstance.createRecipe(
        2,
        resourceInstance.address,
        [1, 2, 3],
        [10, 10, 10],
        resourceInstance.address,
        4,
      );
      await expect(tx1)
        .to.emit(refineryInstance, "RecipeCreated")
        .withArgs(2, resourceInstance.address, [1, 2, 3], [10, 10, 10], resourceInstance.address, 4);
    });

    it("should fail: recipe already exist", async function () {
      const tx1 = refineryInstance.createRecipe(
        1,
        resourceInstance.address,
        [1, 2, 3],
        [10, 10, 10],
        resourceInstance.address,
        4,
      );
      await expect(tx1).to.be.revertedWith("CraftERC1155: recipe already exist");
    });

    it("should fail: ids and amounts length mismatch", async function () {
      const tx1 = refineryInstance.createRecipe(
        1,
        resourceInstance.address,
        [1, 2, 3],
        [10, 10],
        resourceInstance.address,
        4,
      );
      await expect(tx1).to.be.revertedWith("CraftERC1155: ids and amounts length mismatch");
    });

    it("should fail: reserved token id", async function () {
      const tx1 = refineryInstance.createRecipe(
        1,
        resourceInstance.address,
        [1, 2, 3],
        [10, 10, 10],
        resourceInstance.address,
        0,
      );
      await expect(tx1).to.be.revertedWith("CraftERC1155: reserved token id");
    });

    it("should fail: for wrong role", async function () {
      const tx = refineryInstance
        .connect(this.receiver)
        .createRecipe(1, resourceInstance.address, [1, 2, 3], [10, 10, 10], resourceInstance.address, 4);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });
  });

  describe("updateRecipe", function () {
    it("should update recipe", async function () {
      const tx1 = refineryInstance.updateRecipe(1, false);
      await expect(tx1).to.emit(refineryInstance, "RecipeUpdated").withArgs(1, false);
    });

    it("should fail: recipe does not exist", async function () {
      const tx1 = refineryInstance.updateRecipe(0, false);
      await expect(tx1).to.be.revertedWith("CraftERC1155: recipe does not exist");
      const tx2 = refineryInstance.updateRecipe(2, false);
      await expect(tx2).to.be.revertedWith("CraftERC1155: recipe does not exist");
    });

    it("should fail: for wrong role", async function () {
      const tx1 = refineryInstance.connect(this.receiver).updateRecipe(0, false);
      await expect(tx1).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });
  });
});
