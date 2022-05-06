import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Coin } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../constants";

describe("Coin", function () {
  let coin: ContractFactory;
  let coinInstance: Coin;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    coin = await ethers.getContractFactory("Coin");
    [owner, receiver] = await ethers.getSigners();

    coinInstance = (await coin.deploy(tokenName, tokenSymbol, amount)) as Coin;
  });

  describe("constructor", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await coinInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await coinInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isSnapshoter = await coinInstance.hasRole(SNAPSHOT_ROLE, owner.address);
      expect(isSnapshoter).to.equal(true);
    });

    it("should assign the total supply of tokens to the owner", async function () {
      await coinInstance.mint(owner.address, amount);
      const totalSupply = await coinInstance.totalSupply();
      expect(totalSupply).to.equal(amount);
      const ownerBalance = await coinInstance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(amount);
    });
  });

  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      await coinInstance.blacklist(receiver.address);
      const tx = coinInstance.transfer(receiver.address, amount);
      await expect(tx).to.be.revertedWith(`Coin: receiver is BlackListed`);
    });
  });
});
