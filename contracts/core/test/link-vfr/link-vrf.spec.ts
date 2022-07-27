import { use, expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { decimals, LINK_ADDR, tokenName, tokenSymbol, VRF_ADDR } from "../constants";

use(solidity);

describe.skip("VRF LINK", function () {
  async function deployLinkVrfFixture() {
    const [owner] = await ethers.getSigners();

    // Deploy Chainlink & Vrf contracts
    const link = await ethers.getContractFactory("LinkErc20");
    const linkInstance = await link.deploy(tokenName, tokenSymbol);
    console.info(`LINK_ADDR=${linkInstance.address}`);
    const linkAmountInWei = BigNumber.from("10000000000000").mul(decimals);
    await linkInstance.mint(owner.address, linkAmountInWei);
    const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
    const vrfInstance = await vrfFactory.deploy(linkInstance.address);
    console.info(`VRF_ADDR=${vrfInstance.address}`);
    return { linkInstance, vrfInstance };
  }

  it("Should deploy at right addresses", async function () {
    const { linkInstance, vrfInstance } = await loadFixture(deployLinkVrfFixture);

    expect(linkInstance.address).equal(LINK_ADDR);
    expect(vrfInstance.address).equal(VRF_ADDR);
  });
});
