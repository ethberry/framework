import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, utils } from "ethers";

import { amount, MINTER_ROLE } from "@gemunion/contracts-constants";

import { externalId, params, tokenId } from "../constants";
import { deployErc1155Base, deployErc20Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { isEqualArray, isEqualEventArgArrObj } from "../utils";

describe("ExchangeCraft", function () {
  describe("craft", function () {
    describe("NULL > NULL", function () {
      it("NULL > NULL", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(params, [], [], signature);

        // https://github.com/TrueFiEng/Waffle/pull/751
        await expect(tx1)
          .to.emit(exchangeInstance, "Craft")
          .withArgs(receiver.address, externalId, isEqualArray([]), isEqualArray([]));
      });
    });

    describe("NULL > ERC721", function () {
      it("should purchase", async function () {
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

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          [],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Craft")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
            isEqualArray([]),
          );
      });
    });

    describe("NULL > ERC1155", function () {
      it("should purchase", async function () {
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

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Craft")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
            isEqualArray([]),
          );
      });
    });

    describe("NATIVE > ERC721", function () {
      it("should purchase", async function () {
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
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          // .to.changeEtherBalance(receiver, -amount)
          .to.emit(exchangeInstance, "Craft")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(1),
            }),
            isEqualEventArgArrObj({
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId);
      });

      it("should fail: Wrong amount", async function () {
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
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          signature,
          {
            value: 0,
          },
        );

        await expect(tx1).to.be.revertedWith(`Exchange: Wrong amount`);
      });
    });

    describe("ERC20 > ERC721", function () {
      it("should craft", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
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
          .to.emit(exchangeInstance, "Craft")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(1),
            }),
            isEqualEventArgArrObj({
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(receiver.address, exchangeInstance.address, amount);
      });

      it("should fail: insufficient allowance", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(receiver.address, amount);
        // await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
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

        await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
      });

      it("should fail: transfer amount exceeds balance", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        // await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
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

        await expect(tx1).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
      });
    });

    describe("ERC1155 > ERC721", function () {
      it("should craft", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

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
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
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
          .to.emit(exchangeInstance, "Craft")
          // https://github.com/TrueFiEng/Waffle/pull/751
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
            isEqualEventArgArrObj({
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          );
      });

      it("should fail: caller is not token owner nor approved", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        // await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
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

        await expect(tx1).to.be.revertedWith(`ERC1155: caller is not token owner or approved`);
      });

      it("should fail: insufficient balance for transfer", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        // await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
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

        await expect(tx1).to.be.revertedWith(`ERC1155: insufficient balance for transfer`);
      });
    });

    describe("NATIVE > ERC1155", function () {
      it("should craft", async function () {
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
          price: [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          // .to.changeEtherBalance(receiver, -amount)
          .to.emit(exchangeInstance, "Craft")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
            isEqualEventArgArrObj({
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, constants.AddressZero, receiver.address, tokenId, amount);
      });

      it("should fail: Wrong amount", async function () {
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
          price: [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          signature,
          {
            value: 0,
          },
        );

        await expect(tx1).to.be.revertedWith(`Exchange: Wrong amount`);
      });
    });

    describe("ERC20 > ERC1155", function () {
      it("should craft", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
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
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
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
          .to.emit(exchangeInstance, "Craft")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
            isEqualEventArgArrObj({
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, constants.AddressZero, receiver.address, tokenId, amount)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(receiver.address, exchangeInstance.address, amount);
      });

      it("should fail: insufficient allowance", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
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
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(receiver.address, amount);
        // await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
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

        await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
      });

      it("should fail: transfer amount exceeds balance", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
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
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        // await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
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

        await expect(tx1).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
      });
    });

    describe("ERC1155 > ERC1155", function () {
      it("should craft", async function () {
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
              tokenId: 2,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount: 1,
            },
          ],
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
          .to.emit(exchangeInstance, "Craft")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: BigNumber.from(2),
              amount: BigNumber.from(1),
            }),
            isEqualEventArgArrObj({
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: BigNumber.from(tokenId),
              amount: BigNumber.from(amount),
            }),
          );
      });

      it("should fail: caller is not token owner nor approved", async function () {
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
              tokenId: 1,
              amount,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          ],
        });

        await erc1155Instance.mint(receiver.address, 2, amount, "0x");
        // await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
          ],
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: caller is not token owner or approved`);
      });

      it("should fail: insufficient balance for transfer", async function () {
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
              tokenId: 1,
              amount,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          ],
        });

        // await erc1155Instance.mint(receiver.address, 2, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
          ],
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: insufficient balance for transfer`);
      });
    });
  });

  describe("ERROR", function () {
    it("should fail: duplicate mint", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params,
        items: [],
        price: [],
      });

      const tx1 = exchangeInstance.connect(receiver).craft(params, [], [], signature);

      await expect(tx1).to.emit(exchangeInstance, "Craft");

      const tx2 = exchangeInstance.connect(receiver).craft(params, [], [], signature);
      await expect(tx2).to.be.revertedWith("Exchange: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const [_owner] = await ethers.getSigners();
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      const tx = exchangeInstance.craft(params, [], [], utils.formatBytes32String("signature").padEnd(132, "0"));

      await expect(tx).to.be.revertedWith("ECDSA: invalid signature");
    });

    it("should fail for wrong signature", async function () {
      const [_owner] = await ethers.getSigners();
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      const tx = exchangeInstance.craft(params, [], [], utils.formatBytes32String("signature"));

      await expect(tx).to.be.revertedWith("ECDSA: invalid signature length");
    });

    it("should fail: paused", async function () {
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      await exchangeInstance.pause();

      const tx1 = exchangeInstance.craft(
        params,
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
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
            tokenId: 2,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
      await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

      await exchangeInstance.renounceRole(MINTER_ROLE, owner.address);

      const tx1 = exchangeInstance.connect(receiver).craft(
        params,
        [
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId: 2,
            amount: 1,
          },
        ],
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

      await expect(tx1).to.be.revertedWith("Exchange: Wrong signer");
    });
  });
});
