import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";
import { Network } from "@ethersproject/networks";

import { ERC1155Simple, ERC20Simple, ERC721Mysterybox, ERC721Simple, Exchange } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  params,
  PAUSER_ROLE,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { wrapManyToManySignature } from "./shared/utils";

describe("ExchangeMysterybox", function () {
  let exchangeInstance: Exchange;
  let erc20Instance: ERC20Simple;
  let erc721SimpleInstance: ERC721Simple;
  let erc1155Instance: ERC1155Simple;
  let mysteryboxInstance: ERC721Mysterybox;
  let network: Network;

  let generateSignature: (values: Record<string, any>) => Promise<string>;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const exchangeFactory = await ethers.getContractFactory("Exchange");
    exchangeInstance = await exchangeFactory.deploy(tokenName);

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);
    await erc20Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721SimpleInstance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721SimpleInstance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);
    await erc1155Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const mysteryboxFactory = await ethers.getContractFactory("ERC721Mysterybox");
    mysteryboxInstance = await mysteryboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await mysteryboxInstance.grantRole(MINTER_ROLE, exchangeInstance.address);

    network = await ethers.provider.getNetwork();

    generateSignature = wrapManyToManySignature(network, exchangeInstance, this.owner);

    this.contractInstance = exchangeInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("mysterybox", function () {
    describe("NATIVE > MYSTERYBOX (ERC721)", function () {
      it("should mysterybox", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721SimpleInstance.address,
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

        const tx1 = exchangeInstance.connect(this.receiver).mysterybox(
          params,
          [
            {
              tokenType: 2,
              token: erc721SimpleInstance.address,
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
          this.owner.address,
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          // .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(exchangeInstance, "Mysterybox")
          // .withArgs(
          //   this.receiver.address,
          //   [[2, erc721SimpleInstance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(mysteryboxInstance, "Transfer")
          .withArgs(constants.AddressZero, this.receiver.address, tokenId);
      });
    });

    describe("NATIVE > MYSTERYBOX (ERC1155)", function () {
      it("should mysterybox", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
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

        const tx1 = exchangeInstance.connect(this.receiver).mysterybox(
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
          this.owner.address,
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          // .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(exchangeInstance, "Mysterybox")
          // .withArgs(
          //   this.receiver.address,
          //   [[2, erc721SimpleInstance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(mysteryboxInstance, "Transfer")
          .withArgs(constants.AddressZero, this.receiver.address, tokenId);
      });
    });
  });
});
