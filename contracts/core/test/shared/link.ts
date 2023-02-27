import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";

export async function deployLinkVrfFixture() {
  // Deploy Chainlink & Vrf contracts
  const link = await ethers.getContractFactory("LinkToken");
  const linkInstance = await link.deploy();
  await linkInstance.deployed();
  // console.info(`LINK_ADDR=${linkInstance.address}`);
  const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  const vrfInstance = await vrfFactory.deploy(linkInstance.address);
  await vrfInstance.deployed();
  // GET CHAIN_LINK V2 TO WORK
  await vrfInstance.setConfig(3, 1000000, 1, 1, 1);
  await vrfInstance.createSubscription();
  const vrfEventFilter = vrfInstance.filters.SubscriptionCreated();
  const vrfEvents = await vrfInstance.queryFilter(vrfEventFilter);
  const subsriptionId = vrfEvents[0].args.subId;
  expect(subsriptionId).to.equal(1);

  const tx01 = linkInstance.transferAndCall(
    vrfInstance.address,
    ethers.constants.WeiPerEther.mul(18),
    utils.hexZeroPad(ethers.utils.hexlify(~~subsriptionId.toString()), 32),
  );
  await expect(tx01)
    .to.emit(vrfInstance, "SubscriptionFunded")
    .withArgs(subsriptionId, 0, ethers.constants.WeiPerEther.mul(18));

  // console.info(`VRF_ADDR=${vrfInstance.address}`);
  return { linkInstance, vrfInstance };
}
