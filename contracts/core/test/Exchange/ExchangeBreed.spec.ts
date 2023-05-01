import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount } from "@gemunion/contracts-constants";

import { expiresAt, externalId, params, tokenId } from "../constants";
import { deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { IERC721Random, VRFCoordinatorMock } from "../../typechain-types";
import { deployLinkVrfFixture } from "../shared/link";
import { randomRequest } from "../shared/randomRequest";
import { decodeGenes, decodeMetadata, decodeNumber } from "../shared/metadata";
import { isEqualEventArgObj } from "../utils";

describe("ExchangeBreed", function () {
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

  describe("breed", function () {
    describe("ERC721Genes", function () {
      it("should breed", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721GenesHardhat", exchangeInstance);
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, erc721Instance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721Instance.address);

        const genesis0 = {
          templateId: 128,
          matronId: 0,
          sireId: 1,
        };
        const encodedExternalId0 = BigNumber.from(
          utils.hexlify(
            utils.concat([
              utils.zeroPad(utils.hexlify(genesis0.sireId), 3),
              utils.zeroPad(utils.hexlify(genesis0.matronId), 4),
              utils.zeroPad(utils.hexlify(genesis0.templateId), 4),
            ]),
          ),
        );
        await erc721Instance.mintRandom(receiver.address, encodedExternalId0);
        const genesis1 = {
          templateId: 128,
          matronId: 1,
          sireId: 0,
        };
        const encodedExternalId1 = BigNumber.from(
          utils.hexlify(
            utils.concat([
              utils.zeroPad(utils.hexlify(genesis1.sireId), 3),
              utils.zeroPad(utils.hexlify(genesis1.matronId), 4),
              utils.zeroPad(utils.hexlify(genesis1.templateId), 4),
            ]),
          ),
        );
        await erc721Instance.mintRandom(receiver.address, encodedExternalId1);

        await randomRequest(erc721Instance as IERC721Random, vrfInstance);

        const balance1 = await erc721Instance.balanceOf(receiver.address);
        expect(balance1).to.equal(2);

        const genesis = {
          templateId: 128,
          matronId: 256,
          sireId: 1024,
        };
        const encodedExternalId = BigNumber.from(
          utils.hexlify(
            utils.concat([
              utils.zeroPad(utils.hexlify(genesis.sireId), 3),
              utils.zeroPad(utils.hexlify(genesis.matronId), 4),
              utils.zeroPad(utils.hexlify(genesis.templateId), 4),
            ]),
          ),
        );
        // const encodedExternalId = BigNumber.from("0x0004000000010000000080");
        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce"),
            externalId: encodedExternalId,
            expiresAt,
            referrer: constants.AddressZero,
          },
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).breed(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: encodedExternalId,
            expiresAt,
            referrer: constants.AddressZero,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Breed")
          .withArgs(
            receiver.address,
            encodedExternalId,
            isEqualEventArgObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(1),
              amount: BigNumber.from(1),
            }),
            isEqualEventArgObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(2),
              amount: BigNumber.from(1),
            }),
          );

        // RANDOM
        await randomRequest(erc721Instance as IERC721Random, vrfInstance);
        const balance2 = await erc721Instance.balanceOf(receiver.address);
        expect(balance2).to.equal(3);

        // TEST METADATA
        const decodedMeta = decodeMetadata(await erc721Instance.getTokenMetadata(3));
        expect(decodedMeta.TEMPLATE_ID).to.equal(genesis.templateId.toString());

        const genes = decodedMeta.GENES;
        const decodedParents = decodeGenes(BigNumber.from(genes), ["matronId", "sireId"].reverse());
        expect(decodedParents.matronId).to.equal(genesis.matronId);
        expect(decodedParents.sireId).to.equal(genesis.sireId);
        const random = decodeNumber(BigNumber.from(genes)).slice(0, 6);
        expect(random.join("").length).to.be.greaterThan(50); // todo better check ????
      });

      it("should fail: pregnancy count", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, erc721Instance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721Instance.address);

        await erc721Instance.mintCommon(receiver.address, 1);
        await erc721Instance.mintCommon(receiver.address, 2);

        const balance1 = await erc721Instance.balanceOf(receiver.address);
        expect(balance1).to.equal(2);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).breed(
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Breed")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(1),
              amount: BigNumber.from(1),
            }),
            isEqualEventArgObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(2),
              amount: BigNumber.from(1),
            }),
          );

        // RANDOM
        await randomRequest(erc721Instance as IERC721Random, vrfInstance);
        const balance2 = await erc721Instance.balanceOf(receiver.address);
        expect(balance2).to.equal(3);

        await exchangeInstance.setPregnancyLimits(1, 10000, 60 * 2 ** 13);

        const signature1 = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce1"),
            externalId,
            expiresAt,
            referrer: constants.AddressZero,
          },
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });
        const tx2 = exchangeInstance.connect(receiver).breed(
          {
            nonce: utils.formatBytes32String("nonce1"),
            externalId,
            expiresAt,
            referrer: constants.AddressZero,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature1,
        );
        await expect(tx2).to.be.revertedWithCustomError(exchangeInstance, "CountExceed");

        await erc721Instance.mintCommon(receiver.address, 4);
        const signature2 = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce2"),
            externalId,
            expiresAt,
            referrer: constants.AddressZero,
          },
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 4,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });
        const tx3 = exchangeInstance.connect(receiver).breed(
          {
            nonce: utils.formatBytes32String("nonce2"),
            externalId,
            expiresAt,
            referrer: constants.AddressZero,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 4,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature2,
        );
        await expect(tx3).to.be.revertedWithCustomError(exchangeInstance, "CountExceed");
      });

      it("should fail: pregnancy time", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, erc721Instance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721Instance.address);

        await erc721Instance.mintCommon(receiver.address, 1);
        await erc721Instance.mintCommon(receiver.address, 2);

        const balance1 = await erc721Instance.balanceOf(receiver.address);
        expect(balance1).to.equal(2);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).breed(
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature,
        );
        await expect(tx1)
          .to.emit(exchangeInstance, "Breed")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(1),
              amount: BigNumber.from(1),
            }),
            isEqualEventArgObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(2),
              amount: BigNumber.from(1),
            }),
          );

        // RANDOM
        await randomRequest(erc721Instance as IERC721Random, vrfInstance);
        const balance2 = await erc721Instance.balanceOf(receiver.address);
        expect(balance2).to.equal(3);

        await exchangeInstance.setPregnancyLimits(10, 10000, 60 * 2 ** 13);

        const signature1 = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce1"),
            externalId,
            expiresAt,
            referrer: constants.AddressZero,
          },
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });
        const tx2 = exchangeInstance.connect(receiver).breed(
          {
            nonce: utils.formatBytes32String("nonce1"),
            externalId,
            expiresAt,
            referrer: constants.AddressZero,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature1,
        );
        await expect(tx2).to.be.revertedWithCustomError(exchangeInstance, "LimitExceed");

        // await erc721Instance.mintCommon(receiver.address, 4);
        // const signature2 = await generateOneToOneSignature({
        //   account: receiver.address,
        //   params: {
        //     nonce: utils.formatBytes32String("nonce2"),
        //     externalId,
        //     expiresAt,
        //     referrer: constants.AddressZero,
        //   },
        //   item: {
        //     tokenType: 2,
        //     token: erc721Instance.address,
        //     tokenId: 4,
        //     amount: 1,
        //   },
        //   price: {
        //     tokenType: 2,
        //     token: erc721Instance.address,
        //     tokenId: 2,
        //     amount: 1,
        //   },
        // });
        // const tx3 = exchangeInstance.connect(receiver).breed(
        //   {
        //     nonce: utils.formatBytes32String("nonce2"),
        //     externalId,
        //     expiresAt,
        //     referrer: constants.AddressZero,
        //   },
        //   {
        //     tokenType: 2,
        //     token: erc721Instance.address,
        //     tokenId: 4,
        //     amount: 1,
        //   },
        //   {
        //     tokenType: 2,
        //     token: erc721Instance.address,
        //     tokenId: 2,
        //     amount: 1,
        //   },
        //   owner.address,
        //   signature2,
        // );
        // await expect(tx3).to.be.revertedWith("Exchange: pregnancy time limit");
      });

      it("should fail: Not an owner", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, erc721Instance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721Instance.address);

        await erc721Instance.mintCommon(owner.address, 1);
        await erc721Instance.mintCommon(receiver.address, 2);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });

        const tx1 = exchangeInstance.connect(receiver).breed(
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "NotAnOwner");
      });

      it("should fail: Invalid signature", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);

        const signature = await generateOneToOneSignature({
          account: owner.address, // should be receiver.address
          params,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });

        const tx1 = exchangeInstance.connect(receiver).breed(
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature,
        );

        // ECDSA always returns an address
        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
      });

      it("should fail: Wrong signer", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);

        const signature = await generateOneToOneSignature({
          account: owner.address,
          params,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          price: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
        });

        const tx1 = exchangeInstance.connect(receiver).breed(
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount: 1,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 2,
            amount: 1,
          },
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
      });

      it("should fail: paused", async function () {
        const { contractInstance: exchangeInstance } = await deployExchangeFixture();

        await exchangeInstance.pause();

        const tx1 = exchangeInstance.breed(
          params,
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount,
          },
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount,
          },
          constants.HashZero,
        );

        await expect(tx1).to.be.revertedWith("Pausable: paused");
      });

      // TODO add tests for Breed.sol
    });
  });
});
