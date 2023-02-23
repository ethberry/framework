import { expect } from "chai";
import { ethers, network } from "hardhat";
import { constants } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";

import { IERC721Random, VRFCoordinatorV2Mock } from "../../../typechain-types";
import { templateId, tokenId } from "../../constants";

import { randomRequestV2 } from "../../shared/randomRequest";
import { deployLinkVrfFixtureV2 } from "../../shared/link";
import { deployERC1155 } from "../../ERC1155/shared/fixtures";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "../../ERC721/shared/simple";
import { deployErc721Base } from "../../Exchange/shared/fixture";

describe("ERC721MysteryboxSimple", function () {
  let vrfInstance: VRFCoordinatorV2Mock;

  const factory = () => deployERC721("ERC721MysteryboxTest");
  const erc721Factory = () => deployERC721();
  // const erc721RandomFactory = () => deployERC721("ERC721RandomHardhat");
  const erc1155Factory = () => deployERC1155();

  before(async function () {
    if (network.name === "hardhat") {
      await network.provider.send("hardhat_reset");

      // https://github.com/NomicFoundation/hardhat/issues/2980
      ({ vrfInstance } = await loadFixture(function mysterybox() {
        return deployLinkVrfFixtureV2();
      }));
    }
  });

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeERC721Simple(factory);

  describe("mint", function () {
    it("should mint (singular)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const mysteryboxInstance = await factory();
      const erc721SimpleInstance = await erc721Factory();

      const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId,
          amount: 1,
        },
      ]);

      await expect(tx1)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, receiver.address, tokenId);
    });

    it("should mint (multiple)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const mysteryboxInstance = await factory();
      const erc721SimpleInstance = await erc721Factory();
      const erc1155SimpleInstance = await erc1155Factory();

      const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId: templateId,
          amount: 1,
        },
        {
          tokenType: 4,
          token: erc1155SimpleInstance.address,
          tokenId: templateId,
          amount: 1000,
        },
      ]);

      await expect(tx1)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, receiver.address, tokenId);
    });

    it("should fail: No content", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const mysteryboxInstance = await factory();

      const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, []);

      await expect(tx1).to.be.revertedWith("Mysterybox: no content");
    });
  });

  describe("unpack", function () {
    it("should mint (singular)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const mysteryboxInstance = await factory();
      const erc721SimpleInstance = await erc721Factory();

      await erc721SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

      const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId: templateId,
          amount: 1,
        },
      ]);

      await expect(tx1)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, receiver.address, tokenId);

      const tx2 = mysteryboxInstance.connect(receiver).unpack(tokenId);
      await expect(tx2)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(receiver.address, constants.AddressZero, tokenId)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(constants.AddressZero, receiver.address, tokenId);
    });

    it("should mint Random (singular)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const mysteryboxInstance = await factory();
      const erc721RandomInstance = await deployErc721Base("ERC721RandomHardhat", mysteryboxInstance.address);

      // Add Consumer to VRFV2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721RandomInstance.address,
          tokenId: templateId,
          amount: 1,
        },
      ]);

      await expect(tx1)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, receiver.address, tokenId);

      const tx2 = mysteryboxInstance.connect(receiver).unpack(tokenId);
      await expect(tx2)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(receiver.address, constants.AddressZero, tokenId)
        .to.emit(mysteryboxInstance, "UnpackMysterybox");

      // RANDOM
      await randomRequestV2(erc721RandomInstance as IERC721Random, vrfInstance);

      const balance = await erc721RandomInstance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint (multiple)", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const mysteryboxInstance = await factory();
      const erc721SimpleInstance = await erc721Factory();
      const erc1155SimpleInstance = await erc1155Factory();

      await erc721SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);
      await erc1155SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

      const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
        {
          tokenType: 2,
          token: erc721SimpleInstance.address,
          tokenId: templateId,
          amount: 1,
        },
        {
          tokenType: 4,
          token: erc1155SimpleInstance.address,
          tokenId: templateId,
          amount,
        },
      ]);

      await expect(tx1)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, receiver.address, tokenId);

      const tx2 = mysteryboxInstance.connect(receiver).unpack(tokenId);
      await expect(tx2)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(receiver.address, constants.AddressZero, tokenId)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(constants.AddressZero, receiver.address, tokenId)
        .to.emit(erc1155SimpleInstance, "TransferSingle")
        .withArgs(mysteryboxInstance.address, constants.AddressZero, receiver.address, tokenId, amount);
    });
  });
});
