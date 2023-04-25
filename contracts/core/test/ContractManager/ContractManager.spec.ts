import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";

import { DEFAULT_ADMIN_ROLE, METADATA_ROLE, MINTER_ROLE, PREDICATE_ROLE } from "@gemunion/contracts-constants";

import { deployContractManager } from "./fixture";

describe("ContractManager", function () {
  const factory = () => deployContractManager(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  it("should add factory", async function () {
    const [_owner, receiver, stranger] = await ethers.getSigners();

    const contractInstance = await factory();
    await contractInstance.addFactory(receiver.address, MINTER_ROLE);
    await contractInstance.addFactory(stranger.address, METADATA_ROLE);
    const minters = await contractInstance.getMinters();
    const manipulators = await contractInstance.getManipulators();
    expect(minters[0]).to.equal(receiver.address);
    expect(manipulators[0]).to.equal(stranger.address);
  });

  it("should fail add: wrong role", async function () {
    const [_owner] = await ethers.getSigners();

    const contractInstance = await factory();
    const tx = contractInstance.addFactory(_owner.address, DEFAULT_ADMIN_ROLE);
    await expect(tx).to.be.revertedWith("ContractManager: Wrong role");
  });

  it("should remove factory", async function () {
    const [owner, receiver, stranger] = await ethers.getSigners();

    const contractInstance = await factory();
    await contractInstance.addFactory(owner.address, MINTER_ROLE);
    await contractInstance.addFactory(receiver.address, MINTER_ROLE);
    await contractInstance.addFactory(stranger.address, MINTER_ROLE);

    await contractInstance.addFactory(owner.address, METADATA_ROLE);
    await contractInstance.addFactory(stranger.address, METADATA_ROLE);
    await contractInstance.addFactory(receiver.address, METADATA_ROLE);

    const minters0 = await contractInstance.getMinters();
    const manipulators0 = await contractInstance.getManipulators();

    expect(minters0).to.deep.equal([owner.address, receiver.address, stranger.address]);
    expect(manipulators0).to.deep.equal([owner.address, stranger.address, receiver.address]);

    await contractInstance.removeFactory(receiver.address, constants.HashZero);

    const minters1 = await contractInstance.getMinters();
    const manipulators1 = await contractInstance.getManipulators();

    expect(minters1).to.deep.equal([owner.address, stranger.address]);
    expect(manipulators1).to.deep.equal([owner.address, stranger.address]);
  });

  it("should fail remove: wrong role", async function () {
    const [owner, receiver] = await ethers.getSigners();

    const contractInstance = await factory();
    await contractInstance.addFactory(owner.address, MINTER_ROLE);
    await contractInstance.addFactory(receiver.address, MINTER_ROLE);

    const minters0 = await contractInstance.getMinters();

    expect(minters0).to.deep.equal([owner.address, receiver.address]);

    const tx = contractInstance.removeFactory(receiver.address, PREDICATE_ROLE);
    await expect(tx).to.be.revertedWith("ContractManager: Wrong role");
  });

  it("should fail: factory exists", async function () {
    const [_owner, receiver, stranger] = await ethers.getSigners();

    const contractInstance = await factory();
    await contractInstance.addFactory(receiver.address, MINTER_ROLE);
    const tx0 = contractInstance.addFactory(receiver.address, MINTER_ROLE);
    await expect(tx0).to.be.revertedWith("ContractManager: Factory exists");
    await contractInstance.addFactory(stranger.address, METADATA_ROLE);
    const tx1 = contractInstance.addFactory(stranger.address, METADATA_ROLE);
    await expect(tx1).to.be.revertedWith("ContractManager: Factory exists");

    const minters = await contractInstance.getMinters();
    const manipulators = await contractInstance.getManipulators();
    expect(minters[0]).to.equal(receiver.address);
    expect(manipulators[0]).to.equal(stranger.address);
  });

  it("should fail: wrong role", async function () {
    const [_owner, receiver] = await ethers.getSigners();
    const contractInstance = await factory();
    const tx = contractInstance.connect(receiver).destroy();
    await expect(tx).to.be.revertedWith(
      `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
    );
  });

  it("should destroy", async function () {
    const contractInstance = await factory();
    const tx = await contractInstance.destroy();
    await expect(tx).not.to.be.reverted;
  });
});
