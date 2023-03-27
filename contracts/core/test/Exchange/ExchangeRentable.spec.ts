import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";
import { nonce, amount } from "@gemunion/contracts-constants";

import { externalId, templateId, tokenId } from "../constants";

import { deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { deployERC20 } from "../ERC20/shared/fixtures";

describe("ExchangeRentable", function () {
  describe("borrow", function () {
    describe("borrow purchase", function () {
      it("should borrow ERC721 to user for free", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

        const tx0 = erc721Instance.mintCommon(_owner.address, templateId);
        await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, _owner.address, tokenId);

        await erc721Instance.approve(exchangeInstance.address, tokenId);

        // borrow TIME
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,

        const signature = await generateManyToManySignature({
          account: _owner.address,
          params: {
            nonce,
            externalId,
            expiresAt: endTimestamp,
            referrer: receiver.address,
          },
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.borrow(
          {
            nonce,
            externalId,
            expiresAt: endTimestamp,
            referrer: receiver.address,
          },
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          [],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Borrow")
          .to.emit(erc721Instance, "UpdateUser")
          .withArgs(tokenId, receiver.address, endTimestamp);

        const user = await erc721Instance.userOf(tokenId);
        expect(user).to.equal(receiver.address);
        const expires = await erc721Instance.userExpires(tokenId);
        expect(expires).to.equal(endTimestamp);
      });

      it("should borrow ERC721 to user for ERC20", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

        const tx0 = erc721Instance.mintCommon(_owner.address, templateId);
        await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, _owner.address, tokenId);

        const erc20Instance = await deployERC20("ERC20Simple");
        await erc20Instance.mint(_owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);
        await erc721Instance.approve(exchangeInstance.address, tokenId);

        // borrow TIME
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,

        const signature = await generateManyToManySignature({
          account: _owner.address,
          params: {
            nonce,
            externalId,
            expiresAt: endTimestamp,
            referrer: receiver.address,
          },
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

        const tx1 = exchangeInstance.borrow(
          {
            nonce,
            externalId,
            expiresAt: endTimestamp,
            referrer: receiver.address,
          },
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
          .to.changeTokenBalances(erc20Instance, [_owner, exchangeInstance], [-amount, amount])
          .to.emit(exchangeInstance, "Borrow")
          .to.emit(erc721Instance, "UpdateUser")
          .withArgs(tokenId, receiver.address, endTimestamp);

        const user = await erc721Instance.userOf(tokenId);
        expect(user).to.equal(receiver.address);
        const expires = await erc721Instance.userExpires(tokenId);
        expect(expires).to.equal(endTimestamp);
      });
      // TODO error cases
    });
  });
});
