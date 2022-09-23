import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { amount, externalId, nonce, params, tokenId } from "../../constants";
import { wrapOneToManySignature } from "./shared/utils";
import { deployErc20Fixture, deployErc721Fixture, deployExchangeFixture } from "./shared/fixture";

describe("ExchangeCore", function () {
  // shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("purchase", function () {
    it("should purchase, spend ERC20", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

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

      const tx1 = exchangeInstance.connect(receiver).purchase(
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

      await expect(tx1).to.emit(exchangeInstance, "Purchase");
    });

    it("should purchase, spend ETH", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

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
            amount: "123000000000000000",
            token: "0x0000000000000000000000000000000000000000",
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        [
          {
            amount: "123000000000000000",
            token: "0x0000000000000000000000000000000000000000",
            tokenId: "0",
            tokenType: 0,
          },
        ],
        owner.address,
        signature,
        { value: BigNumber.from("123000000000000000") },
      );

      await expect(tx1).to.emit(exchangeInstance, "Purchase");
    });

    it("should fail: duplicate mint", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

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

      const tx1 = exchangeInstance.connect(receiver).purchase(
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

      await expect(tx1).to.emit(exchangeInstance, "Purchase");

      const tx2 = exchangeInstance.connect(receiver).purchase(
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
      await expect(tx2).to.be.revertedWith("Exchange: Expired signature");
    });

    it("should fail: wrong signer", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { exchangeInstance } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

      const network = await ethers.provider.getNetwork();
      const generateOneToManySignature = wrapOneToManySignature(network, exchangeInstance, stranger);

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

      const tx1 = exchangeInstance.connect(receiver).purchase(
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
        stranger.address,
        signature,
      );

      await expect(tx1).to.be.revertedWith(`Exchange: Wrong signer`);
    });

    it("should fail: wrong signer role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

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

      const tx1 = exchangeInstance.connect(receiver).purchase(
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
        receiver.address,
        signature,
      );

      await expect(tx1).to.be.revertedWith(`Exchange: Wrong signer`);
    });

    it("should fail: wrong signature", async function () {
      const [owner] = await ethers.getSigners();
      const { exchangeInstance } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

      const tx = exchangeInstance.purchase(
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
        utils.formatBytes32String("signature"),
      );

      await expect(tx).to.be.revertedWith(`Exchange: Invalid signature`);
    });

    it("should fail: expired signature", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
      const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

      const expiresAt = (await time.latest()).toString();
      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
      };
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

      const tx = exchangeInstance.connect(receiver).purchase(
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

      await expect(tx).to.be.revertedWith(`Exchange: Expired signature`);
    });
  });
});
