import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC20Simple, ERC721Graded, Exchange } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  templateId,
  MINTER_ROLE,
  params,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";
import { wrapOneToManySignature } from "./shared/utils";

describe("ExchangeGrade", function () {
  let exchangeInstance: Exchange;
  let erc20Instance: ERC20Simple;
  let erc721Instance: ERC721Graded;
  let network: Network;

  let generateSignature: (values: Record<string, any>) => Promise<string>;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const mdmFactory = await ethers.getContractFactory("Exchange");
    exchangeInstance = await mdmFactory.deploy(tokenName);

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);
    // await erc20Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const erc721Factory = await ethers.getContractFactory("ERC721Graded");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    network = await ethers.provider.getNetwork();

    generateSignature = wrapOneToManySignature(network, exchangeInstance, this.owner);

    this.contractInstance = exchangeInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  describe("upgrade", function () {
    it("should update metadata", async function () {
      const tx1 = erc721Instance.mintCommon(this.receiver.address, templateId);

      await expect(tx1)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        ingredients: [
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

      const tx2 = exchangeInstance.connect(this.receiver).upgrade(
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
        this.owner.address,
        signature,
      );

      await expect(tx2)
        .to.emit(exchangeInstance, "Upgrade")
        // .withArgs(
        //   this.receiver.address,
        //   externalId,
        //   [2, erc721Instance.address, tokenId, amount],
        //   [[1, erc20Instance.address, tokenId, amount]],
        // )
        .to.emit(erc721Instance, "LevelUp")
        .withArgs(exchangeInstance.address, tokenId, 2);
    });

    it("should fail: insufficient allowance", async function () {
      const tx1 = erc721Instance.mintCommon(this.receiver.address, templateId);

      await expect(tx1)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        ingredients: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(this.receiver.address, amount);
      // await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

      const tx2 = exchangeInstance.connect(this.receiver).upgrade(
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
        this.owner.address,
        signature,
      );

      await expect(tx2).to.be.revertedWith(`ERC20: insufficient allowance`);
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const tx1 = erc721Instance.mintCommon(this.receiver.address, templateId);

      await expect(tx1)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        ingredients: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      // await erc20Instance.mint(this.receiver.address, amount);
      await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

      const tx2 = exchangeInstance.connect(this.receiver).upgrade(
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
        this.owner.address,
        signature,
      );

      await expect(tx2).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
    });
  });
});
