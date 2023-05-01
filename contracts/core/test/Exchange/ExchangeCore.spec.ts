import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import {
  amount,
  DEFAULT_ADMIN_ROLE,
  InterfaceId,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
} from "@gemunion/contracts-constants";
import {
  shouldBehaveLikeAccessControl,
  shouldBehaveLikePausable,
  shouldSupportsInterface,
} from "@gemunion/contracts-mocha";

import { externalId, extra, params, tokenId } from "../constants";
import { deployErc20Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { isEqualEventArgArrObj, isEqualEventArgObj } from "../utils";

describe("ExchangeCore", function () {
  const factory = async () => {
    const { contractInstance } = await deployExchangeFixture();
    return contractInstance;
  };

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldBehaveLikePausable(factory);

  describe("purchase", function () {
    it("should purchase, spend ERC20", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

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
        signature,
      );

      await expect(tx1)
        .to.emit(exchangeInstance, "Purchase")
        .withArgs(
          receiver.address,
          externalId,
          isEqualEventArgObj({
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: BigNumber.from(tokenId),
            amount: BigNumber.from(amount),
          }),
          isEqualEventArgArrObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(tokenId),
            amount: BigNumber.from(amount),
          }),
        );
    });

    it("should purchase, spend ETH", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

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
        signature,
        { value: BigNumber.from("123000000000000000") },
      );

      await expect(tx1)
        .to.emit(exchangeInstance, "Purchase")
        .withArgs(
          receiver.address,
          externalId,
          isEqualEventArgObj({
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: BigNumber.from(tokenId),
            amount: BigNumber.from(amount),
          }),
          isEqualEventArgArrObj({
            tokenType: 0,
            token: constants.AddressZero,
            tokenId: BigNumber.from("0"),
            amount: BigNumber.from("123000000000000000"),
          }),
        );
    });

    it("should fail: duplicate mint", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

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
        signature,
      );
      await expect(tx2).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
    });

    it("should fail: signer is missing role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

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

      await exchangeInstance.renounceRole(MINTER_ROLE, owner.address);

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
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongSigner");
    });

    it("should fail: insufficient allowance", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

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
        signature,
      );

      // ECDSA always returns an address
      await expect(tx1).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: wrong signature", async function () {
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();
      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

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
        utils.formatBytes32String("signature"),
      );

      await expect(tx).to.be.revertedWith("ECDSA: invalid signature length");
    });

    it("should fail: expired signature", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

      const expiresAt = (await time.latest()).toString();
      const params = {
        nonce,
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
        extra,
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
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
    });

    it("should fail: paused", async function () {
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      await exchangeInstance.pause();

      const tx1 = exchangeInstance.purchase(
        params,
        {
          tokenType: 0,
          token: constants.AddressZero,
          tokenId,
          amount,
        },
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
  });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IERC1363Receiver,
    // InterfaceId.IERC1363Spender,
    "0x7b04a2d0",
  );
});
