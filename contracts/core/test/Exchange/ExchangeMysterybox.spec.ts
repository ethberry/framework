import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { params, tokenId } from "../constants";
import { deployErc1155Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";

describe("ExchangeMysterybox", function () {
  describe("mysterybox", function () {
    describe("NATIVE > MYSTERYBOX (ERC721)", function () {
      it("should mysterybox", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance.address);
        const mysteryboxInstance = await deployErc721Base("ERC721MysteryboxSimple", exchangeInstance.address);

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
            {
              tokenType: 2,
              token: mysteryboxInstance.address,
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

        const tx1 = exchangeInstance.connect(receiver).mysterybox(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: mysteryboxInstance.address,
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
          .to.emit(exchangeInstance, "Mysterybox")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(mysteryboxInstance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId);
      });
    });

    describe("NATIVE > MYSTERYBOX (ERC1155)", function () {
      it("should mysterybox", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);
        const mysteryboxInstance = await deployErc721Base("ERC721MysteryboxSimple", exchangeInstance.address);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: mysteryboxInstance.address,
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

        const tx1 = exchangeInstance.connect(receiver).mysterybox(
          params,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount: 1,
            },
            {
              tokenType: 2,
              token: mysteryboxInstance.address,
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
          .to.emit(exchangeInstance, "Mysterybox")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(mysteryboxInstance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId);
      });
    });
  });
});
