import { expect } from "chai";
import { ethers, network } from "hardhat";
import { constants, Contract, Signer, utils } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { IERC721Random, VRFCoordinatorMock } from "../../../typechain-types";
import { FrameworkInterfaceId, templateId, tokenId } from "../../constants";
import { randomRequest } from "../../shared/randomRequest";
import { deployLinkVrfFixture } from "../../shared/link";
import { deployERC1155 } from "../../ERC1155/shared/fixtures";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";

const customMint = (contractInstance: Contract, signer: Signer, receiver: string) => {
  return contractInstance.connect(signer).mintBox(receiver, templateId, [
    {
      tokenType: 0,
      token: constants.AddressZero,
      tokenId: templateId,
      amount,
    },
  ]) as Promise<any>;
};

describe("ERC721MysteryboxSimple", function () {
  let vrfInstance: VRFCoordinatorMock;

  const factory = () => deployERC721("ERC721MysteryboxSimple");
  const erc20Factory = (name: string) => deployERC20(name);
  const erc721Factory = (name: string) => deployERC721(name);
  const erc998Factory = (name: string) => deployERC721(name);
  const erc1155Factory = (name: string) => deployERC1155(name);

  before(async function () {
    if (network.name === "hardhat") {
      await network.provider.send("hardhat_reset");

      // https://github.com/NomicFoundation/hardhat/issues/2980
      ({ vrfInstance } = await loadFixture(function mysterybox() {
        return deployLinkVrfFixture();
      }));
    }
  });

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeERC721Simple(factory, {
    mint: customMint,
    tokenId,
  });
  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    FrameworkInterfaceId.Mystery,
  ]);

  describe("mint", function () {
    it("should fail: No content", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const mysteryboxInstance = await factory();

      const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, []);

      await expect(tx1).to.be.revertedWith("Mysterybox: no content");
    });
  });

  describe("mint/unpack", function () {
    describe("NATIVE", function () {
      it("should mint/unpack", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const mysteryboxInstance = await factory();
        await mysteryboxInstance.topUp(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount: utils.parseEther("1.0"),
            },
          ],
          { value: utils.parseEther("1.0") },
        );

        const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
          {
            tokenType: 0,
            token: constants.AddressZero,
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
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId)
          .to.changeEtherBalances([receiver, mysteryboxInstance], [amount, -amount]);
      });
    });

    describe("ERC20", function () {
      it("should mint/unpack", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const mysteryboxInstance = await factory();
        const erc20SimpleInstance = await erc20Factory("ERC20Simple");
        await erc20SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);
        await erc20SimpleInstance.mint(mysteryboxInstance.address, amount);

        const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
          {
            tokenType: 1,
            token: erc20SimpleInstance.address,
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
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId)
          .to.emit(erc20SimpleInstance, "Transfer")
          .withArgs(mysteryboxInstance.address, receiver.address, amount);
      });
    });

    describe("ERC721", function () {
      it("should mint/unpack (Simple)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const mysteryboxInstance = await factory();
        const erc721SimpleInstance = await erc721Factory("ERC721Simple");
        await erc721SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

        const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
          {
            tokenType: 2,
            token: erc721SimpleInstance.address,
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
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId)
          .to.emit(erc721SimpleInstance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId);
      });

      it("should mint/unpack (Random)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const mysteryboxInstance = await factory();
        const erc721RandomInstance = await erc721Factory("ERC721Random");
        await erc721RandomInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

        const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

        const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
          {
            tokenType: 2,
            token: erc721RandomInstance.address,
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
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId)
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId);

        // RANDOM
        await randomRequest(erc721RandomInstance as IERC721Random, vrfInstance);

        const balance = await erc721RandomInstance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });
    });

    describe("ERC998", function () {
      it("should mint/unpack (Simple)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const mysteryboxInstance = await factory();
        const erc998SimpleInstance = await erc998Factory("ERC998Simple");
        await erc998SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

        const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
          {
            tokenType: 2,
            token: erc998SimpleInstance.address,
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
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId)
          .to.emit(erc998SimpleInstance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId);
      });

      it("should mint/unpack (Random)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const mysteryboxInstance = await factory();
        const erc998RandomInstance = await erc998Factory("ERC998Random");
        await erc998RandomInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

        const tx02 = vrfInstance.addConsumer(1, erc998RandomInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc998RandomInstance.address);

        const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
          {
            tokenType: 2,
            token: erc998RandomInstance.address,
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
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId);

        await randomRequest(erc998RandomInstance, vrfInstance);

        const balance = await erc998RandomInstance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });
    });

    describe("ERC1155", function () {
      it("should mint/unpack", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const mysteryboxInstance = await factory();
        const erc1155SimpleInstance = await erc1155Factory("ERC1155Simple");

        await erc1155SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

        const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
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
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId)
          .to.emit(erc1155SimpleInstance, "TransferSingle")
          .withArgs(mysteryboxInstance.address, constants.AddressZero, receiver.address, tokenId, amount);
      });
    });

    describe("MIX", function () {
      it("should mint/unpack multiple", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const mysteryboxInstance = await factory();

        const erc20SimpleInstance = await erc20Factory("ERC20Simple");

        const erc721SimpleInstance = await erc721Factory("ERC721Simple");
        const erc998SimpleInstance = await erc721Factory("ERC998Simple");
        const erc1155SimpleInstance = await erc1155Factory("ERC1155Simple");

        await erc20SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);
        await erc721SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);
        await erc998SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);
        await erc1155SimpleInstance.grantRole(MINTER_ROLE, mysteryboxInstance.address);

        await mysteryboxInstance.topUp(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount: utils.parseEther("1.0"),
            },
          ],
          { value: utils.parseEther("1.0") },
        );
        await erc20SimpleInstance.mint(mysteryboxInstance.address, amount);

        const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId: templateId,
            amount,
          },
          {
            tokenType: 1,
            token: erc20SimpleInstance.address,
            tokenId: templateId,
            amount,
          },
          {
            tokenType: 2,
            token: erc721SimpleInstance.address,
            tokenId: templateId,
            amount,
          },
          {
            tokenType: 3,
            token: erc998SimpleInstance.address,
            tokenId: templateId,
            amount,
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
          .to.emit(mysteryboxInstance, "UnpackMysterybox")
          .withArgs(tokenId)
          .to.changeEtherBalances([receiver, mysteryboxInstance], [amount, -amount])
          .to.emit(erc20SimpleInstance, "Transfer")
          .withArgs(mysteryboxInstance.address, receiver.address, amount)
          .to.emit(erc721SimpleInstance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId)
          .to.emit(erc998SimpleInstance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId)
          .to.emit(erc1155SimpleInstance, "TransferSingle")
          .withArgs(mysteryboxInstance.address, constants.AddressZero, receiver.address, tokenId, amount);
      });
    });
  });
});
