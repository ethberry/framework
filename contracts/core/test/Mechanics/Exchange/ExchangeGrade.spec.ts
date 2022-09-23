import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";
import { amount, params, templateId, tokenId } from "../../constants";
import { deployErc20Fixture, deployErc721Fixture, deployExchangeFixture } from "./shared/fixture";

describe("ExchangeGrade", function () {
  // shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  describe("upgrade", function () {
    it("should update metadata", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Upgradeable", exchangeInstance);

      const tx1 = erc721Instance.mintCommon(receiver.address, templateId);

      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      const signature = await generateOneToManySignature({
        account: receiver.address,
        params,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
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

      const tx2 = exchangeInstance.connect(receiver).upgrade(
        params,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        owner.address,
        signature,
      );

      await expect(tx2)
        .to.emit(exchangeInstance, "Upgrade")
        // .withArgs(
        //   receiver.address,
        //   externalId,
        //   [2, erc721Instance.address, tokenId, amount],
        //   [[1, erc20Instance.address, tokenId, amount]],
        // )
        .to.emit(erc721Instance, "LevelUp")
        .withArgs(exchangeInstance.address, tokenId, 2);
    });

    it("should fail: insufficient allowance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Upgradeable", exchangeInstance);

      const tx1 = erc721Instance.mintCommon(receiver.address, templateId);

      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      const signature = await generateOneToManySignature({
        account: receiver.address,
        params,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
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

      const tx2 = exchangeInstance.connect(receiver).upgrade(
        params,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        owner.address,
        signature,
      );

      await expect(tx2).to.be.revertedWith(`ERC20: insufficient allowance`);
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Upgradeable", exchangeInstance);

      const tx1 = erc721Instance.mintCommon(receiver.address, templateId);

      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      const signature = await generateOneToManySignature({
        account: receiver.address,
        params,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
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

      const tx2 = exchangeInstance.connect(receiver).upgrade(
        params,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },

        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        owner.address,
        signature,
      );

      await expect(tx2).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
    });
  });
});
