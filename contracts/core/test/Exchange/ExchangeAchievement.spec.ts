import { expect } from "chai";
import { ethers, network } from "hardhat";
import { ZeroAddress } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount, nonce } from "@gemunion/contracts-constants";

import { externalId, extra, params, subscriptionId, tokenId } from "../constants";
import { deployErc1155Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { deployLinkVrfFixture } from "../shared/link";
import { VRFCoordinatorMock } from "../../typechain-types";
import { randomRequest } from "../shared/randomRequest";
import { isEqualEventArgArrObj } from "../utils";

describe("ExchangeAchievement", function () {
  let vrfInstance: VRFCoordinatorMock;

  before(async function () {
    await network.provider.send("hardhat_reset");

    // https://github.com/NomicFoundation/hardhat/issues/2980
    ({ vrfInstance } = await loadFixture(function exchange() {
      return deployLinkVrfFixture();
    }));
  });

  after(async function () {
    await network.provider.send("hardhat_reset");
  });

  describe("achieve", function () {
    describe("ERC721", function () {
      it("should claim (Simple)", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).achieve(
          params,
          [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "AchievementClaimed")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            }),
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should claim (Random)", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);

        const tx02 = await vrfInstance.addConsumer(subscriptionId, await erc721Instance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(subscriptionId, await erc721Instance.getAddress());

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).achieve(
          params,
          [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "AchievementClaimed")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            }),
          )
          .to.not.emit(erc721Instance, "Transfer");

        await randomRequest(erc721Instance, vrfInstance);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should fail: Expired signature", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce,
            externalId,
            expiresAt: 1,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).achieve(
          {
            nonce,
            externalId,
            expiresAt: 1,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });
    });

    describe("ERC1155", function () {
      it("should claim", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).achieve(
          params,
          [
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "AchievementClaimed")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 4n,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount,
            }),
          )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(await exchangeInstance.getAddress(), ZeroAddress, receiver.address, tokenId, amount);

        const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
        expect(balance).to.equal(amount);
      });

      it("should fail: Expired signature", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce,
            externalId,
            expiresAt: 1,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).achieve(
          {
            nonce,
            externalId,
            expiresAt: 1,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });
    });
  });
});
