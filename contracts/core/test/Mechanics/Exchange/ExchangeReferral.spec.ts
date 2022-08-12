import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, utils } from "ethers";
import { Network } from "@ethersproject/networks";

import { ERC20Simple, ERC721Simple, Exchange } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  expiresAt,
  externalId,
  MINTER_ROLE,
  PAUSER_ROLE,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { wrapOneToManySignature } from "./shared/utils";

describe("ExchangeReferral", function () {
  let exchangeInstance: Exchange;
  let erc20Instance: ERC20Simple;
  let erc721Instance: ERC721Simple;
  let network: Network;

  let generateSignature: (values: Record<string, any>) => Promise<string>;

  beforeEach(async function () {
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    const exchangeFactory = await ethers.getContractFactory("Exchange");
    exchangeInstance = await exchangeFactory.deploy(tokenName);

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount * 10);
    await erc20Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    network = await ethers.provider.getNetwork();

    generateSignature = wrapOneToManySignature(network, exchangeInstance, this.owner);

    this.contractInstance = exchangeInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("purchase", function () {
    it("referrer", async function () {
      const params1 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
      };

      const signature1 = await generateSignature({
        account: this.owner.address,
        params: params1,
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

      await erc20Instance.mint(this.owner.address, amount);
      await erc20Instance.connect(this.owner).approve(exchangeInstance.address, amount);

      const tx1 = exchangeInstance.connect(this.owner).purchase(
        params1,
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
        this.owner.address,
        signature1,
      );

      await expect(tx1).to.emit(exchangeInstance, "Purchase").to.not.emit(exchangeInstance, "ReferralReward");

      const params2 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: this.owner.address,
      };

      const signature2 = await generateSignature({
        account: this.receiver.address,
        params: params2,
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

      await erc20Instance.mint(this.receiver.address, amount);
      await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

      const tx2 = exchangeInstance.connect(this.receiver).purchase(
        params2,
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
        this.owner.address,
        signature2,
      );

      await expect(tx2)
        .to.emit(exchangeInstance, "Purchase")
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.receiver.address, this.owner.address, 0, constants.WeiPerEther);

      const params3 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: this.receiver.address,
      };

      const signature3 = await generateSignature({
        account: this.stranger.address,
        params: params3,
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

      await erc20Instance.mint(this.stranger.address, amount);
      await erc20Instance.connect(this.stranger).approve(exchangeInstance.address, amount);

      const tx3 = exchangeInstance.connect(this.stranger).purchase(
        params3,
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
        this.owner.address,
        signature3,
      );

      await expect(tx3)
        .to.emit(exchangeInstance, "Purchase")
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.stranger.address, this.owner.address, 1, constants.WeiPerEther.div(10))
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.stranger.address, this.receiver.address, 0, constants.WeiPerEther);
    });
  });
});
