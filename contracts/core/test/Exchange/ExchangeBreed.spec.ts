import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { decimals } from "@gemunion/contracts-constants";

import { expiresAt, externalId, LINK_ADDR, params, VRF_ADDR } from "../constants";
import { deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { LinkToken, VRFCoordinatorMock } from "../../typechain-types";
import { deployLinkVrfFixture } from "../shared/link";
import { randomRequest } from "../shared/randomRequest";
import { decodeGenes, decodeMetadata, decodeNumber } from "../shared/metadata";

describe("ExchangeBreed", function () {
  let linkInstance: LinkToken;
  let vrfInstance: VRFCoordinatorMock;

  before(async function () {
    await network.provider.send("hardhat_reset");

    // https://github.com/NomicFoundation/hardhat/issues/2980
    ({ linkInstance, vrfInstance } = await loadFixture(function exchange() {
      return deployLinkVrfFixture();
    }));

    expect(linkInstance.address).equal(LINK_ADDR);
    expect(vrfInstance.address).equal(VRF_ADDR);
  });

  after(async function () {
    await network.provider.send("hardhat_reset");
  });

  describe("breed", function () {
    describe("ERC721", function () {
      it("should breed", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721GenesHardhat", exchangeInstance);
        // Fund LINK to erc721Random contract
        await linkInstance.transfer(erc721Instance.address, BigNumber.from("100").mul(decimals));

        await erc721Instance.mintCommon(receiver.address, 1);
        await erc721Instance.mintCommon(receiver.address, 2);

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
            [2, erc721Instance.address, 1, 1],
            [2, erc721Instance.address, 2, 1],
          )
          .to.emit(linkInstance, "Transfer(address,address,uint256)")
          .withArgs(erc721Instance.address, vrfInstance.address, utils.parseEther("0.1"));

        // RANDOM
        await randomRequest(erc721Instance, vrfInstance);
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
        // Fund LINK to erc721Random contract
        await linkInstance.transfer(erc721Instance.address, BigNumber.from("100").mul(decimals));

        await erc721Instance.mintCommon(receiver.address, 1);
        await erc721Instance.mintCommon(receiver.address, 2);

        let balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(2);

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
          .withArgs(receiver.address, externalId, [2, erc721Instance.address, 1, 1], [2, erc721Instance.address, 2, 1])
          .to.emit(linkInstance, "Transfer(address,address,uint256)")
          .withArgs(erc721Instance.address, vrfInstance.address, utils.parseEther("0.1"));

        // RANDOM
        await randomRequest(erc721Instance, vrfInstance);
        balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(3);

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
        await expect(tx2).to.be.revertedWith("Exchange: pregnancy count exceeded");

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
        await expect(tx3).to.be.revertedWith("Exchange: pregnancy count exceeded");
      });

      it("should fail: pregnancy time", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);
        // Fund LINK to erc721Random contract
        await linkInstance.transfer(erc721Instance.address, BigNumber.from("100").mul(decimals));

        await erc721Instance.mintCommon(receiver.address, 1);
        await erc721Instance.mintCommon(receiver.address, 2);

        let balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(2);

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
          .withArgs(receiver.address, externalId, [2, erc721Instance.address, 1, 1], [2, erc721Instance.address, 2, 1])
          .to.emit(linkInstance, "Transfer(address,address,uint256)")
          .withArgs(erc721Instance.address, vrfInstance.address, utils.parseEther("0.1"));

        // RANDOM
        await randomRequest(erc721Instance, vrfInstance);
        balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(3);

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
        await expect(tx2).to.be.revertedWith("Exchange: pregnancy time limit");

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
        // Fund LINK to erc721Random contract
        await linkInstance.transfer(erc721Instance.address, BigNumber.from("100").mul(decimals));

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

        await expect(tx1).to.be.revertedWith("Exchange: Not an owner");
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
        await expect(tx1).to.be.revertedWith("Exchange: Wrong signer");
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

        await expect(tx1).to.be.revertedWith("Exchange: Wrong signer");
      });
    });
  });
});
