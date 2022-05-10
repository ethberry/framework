import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { CoinWithBlackList } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../constants";

describe("CoinWithBlackList", function () {
  let erc20: ContractFactory;
  let erc20Instance: CoinWithBlackList;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("CoinWithBlackList");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as CoinWithBlackList;
  });

  describe("constructor", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await erc20Instance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
      const isSnapshoter = await erc20Instance.hasRole(SNAPSHOT_ROLE, owner.address);
      expect(isSnapshoter).to.equal(true);
    });

    it("should assign the total supply of tokens to the owner", async function () {
      await erc20Instance.mint(owner.address, amount);
      const totalSupply = await erc20Instance.totalSupply();
      expect(totalSupply).to.equal(amount);
      const ownerBalance = await erc20Instance.balanceOf(owner.address);
      expect(ownerBalance).to.equal(amount);
    });
  });

  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      await erc20Instance.blacklist(receiver.address);
      const tx = erc20Instance.transfer(receiver.address, amount);
      await expect(tx).to.be.revertedWith(`Coin: receiver is BlackListed`);
    });
  });
});
