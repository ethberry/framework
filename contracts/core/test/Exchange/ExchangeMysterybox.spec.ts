import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress, ZeroHash } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { externalId, params, tokenId } from "../constants";
import { deployErc1155Base, deployErc20Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { isEqualEventArgArrObj } from "../utils";

describe("ExchangeMysterybox", function () {
  describe("mysterybox", function () {
    describe("NATIVE > MYSTERYBOX (ERC721)", function () {
      it("should purchase mysterybox", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);
        const mysteryboxInstance = await deployErc721Base("ERC721MysteryboxSimple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await mysteryboxInstance.getAddress(),
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: ZeroAddress,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).purchaseMystery(
          params,
          [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await mysteryboxInstance.getAddress(),
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 0,
              token: ZeroAddress,
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
          .to.emit(exchangeInstance, "Mysterybox")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj(
              {
                tokenType: 2n,
                token: await erc721Instance.getAddress(),
                tokenId,
                amount: 1n,
              },
              {
                tokenType: 2n,
                token: await mysteryboxInstance.getAddress(),
                tokenId,
                amount: 1n,
              },
            ),
            isEqualEventArgArrObj({
              tokenType: 0n,
              token: ZeroAddress,
              tokenId,
              amount,
            }),
          )
          .to.emit(mysteryboxInstance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId);
      });
    });

    describe("NATIVE > MYSTERYBOX (ERC1155)", function () {
      it("should purchase mysterybox", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);
        const mysteryboxInstance = await deployErc721Base("ERC721MysteryboxSimple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await mysteryboxInstance.getAddress(),
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: ZeroAddress,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).purchaseMystery(
          params,
          [
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await mysteryboxInstance.getAddress(),
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 0,
              token: ZeroAddress,
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
          .to.emit(exchangeInstance, "Mysterybox")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj(
              {
                tokenType: 4n,
                token: await erc1155Instance.getAddress(),
                tokenId,
                amount: 1n,
              },
              {
                tokenType: 2n,
                token: await mysteryboxInstance.getAddress(),
                tokenId,
                amount: 1n,
              },
            ),
            isEqualEventArgArrObj({
              tokenType: 0n,
              token: ZeroAddress,
              tokenId,
              amount,
            }),
          )
          .to.emit(mysteryboxInstance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId);
      });
    });

    describe("(NATIVE ERC20) > MYSTERYBOX MIXED (ERC20 ERC721 ERC998 ERC1155)", function () {
      it("should purchase mysterybox", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);
        const erc998Instance = await deployErc721Base("ERC998Simple", exchangeInstance);
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

        const mysteryboxInstance = await deployErc721Base("ERC721MysteryboxSimple", exchangeInstance);

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 3,
              token: await erc998Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await mysteryboxInstance.getAddress(),
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: ZeroAddress,
              tokenId,
              amount,
            },
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).purchaseMystery(
          params,
          [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 3,
              token: await erc998Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await mysteryboxInstance.getAddress(),
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 0,
              token: ZeroAddress,
              tokenId,
              amount,
            },
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
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
          .to.emit(exchangeInstance, "Mysterybox")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj(
              {
                tokenType: 1n,
                token: await erc20Instance.getAddress(),
                tokenId,
                amount,
              },
              {
                tokenType: 2n,
                token: await erc721Instance.getAddress(),
                tokenId,
                amount: 1n,
              },
              {
                tokenType: 3n,
                token: await erc998Instance.getAddress(),
                tokenId,
                amount: 1n,
              },
              {
                tokenType: 4n,
                token: await erc1155Instance.getAddress(),
                tokenId,
                amount: 1n,
              },
              {
                tokenType: 2n,
                token: await mysteryboxInstance.getAddress(),
                tokenId,
                amount: 1n,
              },
            ),
            isEqualEventArgArrObj(
              {
                tokenType: 0n,
                token: ZeroAddress,
                tokenId,
                amount,
              },
              {
                tokenType: 1n,
                token: await erc20Instance.getAddress(),
                tokenId,
                amount,
              },
            ),
          )
          .to.emit(mysteryboxInstance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(receiver.address, await exchangeInstance.getAddress(), amount)
          .changeEtherBalances([exchangeInstance, receiver], [amount, -amount]);
      });
    });

    describe("pause", function () {
      it("should fail: paused", async function () {
        const { contractInstance: exchangeInstance } = await deployExchangeFixture();

        await exchangeInstance.pause();

        const tx1 = exchangeInstance.purchaseMystery(
          params,
          [
            {
              tokenType: 0,
              token: ZeroAddress,
              tokenId,
              amount,
            },
            {
              tokenType: 0,
              token: ZeroAddress,
              tokenId,
              amount,
            },
          ],
          [
            {
              tokenType: 0,
              token: ZeroAddress,
              tokenId,
              amount,
            },
          ],
          ZeroHash,
        );

        await expect(tx1).to.be.revertedWith("Pausable: paused");
      });
    });
  });
});
