import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Item } from "../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royaltyNumerator, tokenName, tokenSymbol } from "../constants";

describe("Item", function () {
  let itemToken: ContractFactory;
  let itemInstance: Item;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    itemToken = await ethers.getContractFactory("Item");
    [owner] = await ethers.getSigners();

    itemInstance = (await itemToken.deploy(tokenName, tokenSymbol, baseTokenURI, royaltyNumerator)) as Item;
  });

  describe("hasRole", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await itemInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await itemInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });
});
