import { expect } from "chai";
import { ethers, network } from "hardhat";
import { WeiPerEther } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { MINTER_ROLE } from "@gemunion/contracts-constants";

import { LinkToken, VRFCoordinatorMock } from "../../../../typechain-types";
import { deployLinkVrfFixture } from "../../../shared/link";
import { templateId } from "../../../constants";
import { randomRequest } from "../../../shared/randomRequest";

export function shouldMintRandom(factory: () => Promise<any>) {
  describe("mintRandom", function () {
    let linkInstance: LinkToken;
    let vrfInstance: VRFCoordinatorMock;

    before(async function () {
      await network.provider.send("hardhat_reset");

      // https://github.com/NomicFoundation/hardhat/issues/2980
      ({ linkInstance, vrfInstance } = await loadFixture(function shouldMintRandom() {
        return deployLinkVrfFixture();
      }));
    });

    it("should mintRandom", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      // Add Consumer to VRFV2
      const tx02 = vrfInstance.addConsumer(1, await contractInstance.getAddress());
      await expect(tx02)
        .to.emit(vrfInstance, "SubscriptionConsumerAdded")
        .withArgs(1, await contractInstance.getAddress());
      await contractInstance.mintRandom(receiver.address, templateId);

      if (network.name === "hardhat") {
        await randomRequest(contractInstance, vrfInstance);
      }

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    // TODO mintRandom to receiver
    // TODO mintRandom to nonReceiver

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).mintRandom(receiver.address, templateId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should fail: TemplateZero", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await linkInstance.transfer(await contractInstance.getAddress(), WeiPerEther);

      const tx = contractInstance.mintRandom(receiver.address, 0);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "TemplateZero");
    });
  });
}
