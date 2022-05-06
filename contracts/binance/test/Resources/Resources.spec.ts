import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Resources } from "../../typechain-types";
import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenId } from "../constants";

describe("Resources", function () {
  let nft: ContractFactory;
  let nftInstance: Resources;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    nft = await ethers.getContractFactory("Resources");
    [owner, receiver] = await ethers.getSigners();

    nftInstance = (await nft.deploy(baseTokenURI)) as Resources;
  });

  describe("hasRole", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await nftInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await nftInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  describe("mintBatch", function () {
    it("should fail for wrong role", async function () {
      const tx = nftInstance.connect(receiver).mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should mint", async function () {
      const tx = nftInstance.mintBatch(receiver.address, [tokenId], [amount], "0x");
      await expect(tx)
        .to.emit(nftInstance, "TransferBatch")
        .withArgs(owner.address, ethers.constants.AddressZero, receiver.address, [tokenId], [amount]);

      const balance = await nftInstance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const totalSupply = await nftInstance.totalSupply(tokenId);
      expect(totalSupply).to.equal(amount);
    });
  });
});
