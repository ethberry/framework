import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";
import { amount, params, tokenId } from "../../constants";
import { deployErc1155Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";

describe("ExchangeClaim", function () {
  // shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("claim", function () {
    describe("ERC721", function () {
      it("should claim ", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc721Instance } = await deployErc721Base("ERC721Simple", exchangeInstance);

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
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ethers.constants.AddressZero, receiver.address, tokenId);
      });

      it.skip("should claim random", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc721Instance } = await deployErc721Base("ERC721Random", exchangeInstance);

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
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.not.emit(erc721Instance, "Transfer");
      });
    });

    describe("ERC1155", function () {
      it("should claim", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc1155Instance } = await deployErc1155Base("ERC1155Simple", exchangeInstance);

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
          owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, constants.AddressZero, receiver.address, tokenId, amount);
      });
    });
  });
});
