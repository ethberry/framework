import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber, constants } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount, MINTER_ROLE, nonce } from "@gemunion/contracts-constants";

import { externalId, extra, params, subscriptionId, tokenId } from "../constants";
import { deployErc1155Base, deployErc20Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { deployLinkVrfFixture } from "../shared/link";
import { VRFCoordinatorMock } from "../../typechain-types";
import { randomRequest } from "../shared/randomRequest";
import { isEqualEventArgArrObj } from "../utils";

describe("ExchangeClaim", function () {
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

  describe("claim", function () {
    describe("ERC20", function () {
      it("should claim", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(exchangeInstance.address, amount);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          )
          .to.emit(erc20Instance, "Transfer")
          .withArgs(exchangeInstance.address, receiver.address, amount);

        const balance = await erc20Instance.balanceOf(receiver.address);
        expect(balance).to.equal(amount);
      });

      it("should fail: Expired signature", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(exchangeInstance.address, amount);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce,
            externalId,
            expiresAt: 1,
            referrer: constants.AddressZero,
            extra,
          },
          items: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          {
            nonce,
            externalId,
            expiresAt: 1,
            referrer: constants.AddressZero,
            extra,
          },
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });

      it("should fail: signer is missing role", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(exchangeInstance.address, amount);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        await exchangeInstance.renounceRole(MINTER_ROLE, owner.address);

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongSigner");
      });
    });

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
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should claim (Random)", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);

        const tx02 = await vrfInstance.addConsumer(subscriptionId, erc721Instance.address);
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(subscriptionId, erc721Instance.address);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
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
            referrer: constants.AddressZero,
            extra,
          },
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          {
            nonce,
            externalId,
            expiresAt: 1,
            referrer: constants.AddressZero,
            extra,
          },
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });

      it("should fail: signer is missing role", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        await exchangeInstance.renounceRole(MINTER_ROLE, owner.address);

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongSigner");
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
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, constants.AddressZero, receiver.address, tokenId, amount);

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
            referrer: constants.AddressZero,
            extra,
          },
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          {
            nonce,
            externalId,
            expiresAt: 1,
            referrer: constants.AddressZero,
            extra,
          },
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });

      it("should fail: signer is missing role", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        await exchangeInstance.renounceRole(MINTER_ROLE, owner.address);

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongSigner");
      });
    });

    describe("ERROR", function () {
      it("should fail: paused", async function () {
        const { contractInstance: exchangeInstance } = await deployExchangeFixture();

        await exchangeInstance.pause();

        const tx1 = exchangeInstance.claim(
          params,
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          constants.HashZero,
        );

        await expect(tx1).to.be.revertedWith("Pausable: paused");
      });
    });
  });
});
