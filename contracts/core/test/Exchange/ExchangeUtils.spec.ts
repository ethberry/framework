import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { amount, baseTokenURI, royalty, tokenName, tokenSymbol } from "@gemunion/contracts-constants";
import { templateId, tokenId } from "../constants";

describe("ExchangeUtils", function () {
  describe("spendFrom", function () {
    it("should spendFrom ETH", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const tx = await exchangeMockInstance.connect(receiver).testSpendFrom(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId: 0,
            amount,
          },
        ],
        { value: amount },
      );

      await expect(tx).changeEtherBalances([receiver, exchangeMockInstance], [-amount, amount]);
    });

    it("should spendFrom ERC20", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Simple");
      const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);

      await erc20Instance.mint(receiver.address, amount);

      await erc20Instance.connect(receiver).approve(exchangeMockInstance.address, amount);

      const tx = await exchangeMockInstance.connect(receiver).testSpendFrom([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      ]);

      await expect(tx).changeTokenBalances(erc20Instance, [receiver, exchangeMockInstance], [-amount, amount]);
    });

    it("should spendFrom ERC721", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc721Factory = await ethers.getContractFactory("ERC721Simple");
      const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

      await erc721Instance.mintCommon(receiver.address, templateId);

      await erc721Instance.connect(receiver).approve(exchangeMockInstance.address, templateId);

      await exchangeMockInstance.connect(receiver).testSpendFrom([
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
      ]);

      const balance = await erc721Instance.balanceOf(exchangeMockInstance.address);
      expect(balance).to.equal(1);
    });

    it("should spendFrom ERC998", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc998Factory = await ethers.getContractFactory("ERC998Simple");
      const erc998Instance = await erc998Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

      await erc998Instance.mintCommon(receiver.address, templateId);
      await erc998Instance.connect(receiver).approve(exchangeMockInstance.address, tokenId);

      await exchangeMockInstance.connect(receiver).testSpendFrom([
        {
          tokenType: 3,
          token: erc998Instance.address,
          tokenId,
          amount,
        },
      ]);

      const balance = await erc998Instance.balanceOf(exchangeMockInstance.address);
      expect(balance).to.equal(1);
    });

    it("should spendFrom ERC1155", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
      const erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

      await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");

      await erc1155Instance.connect(receiver).setApprovalForAll(exchangeMockInstance.address, true);

      await exchangeMockInstance.connect(receiver).testSpendFrom([
        {
          tokenType: 4,
          token: erc1155Instance.address,
          tokenId,
          amount,
        },
      ]);

      const balance = await erc1155Instance.balanceOf(exchangeMockInstance.address, tokenId);
      expect(balance).to.equal(amount);
    });
  });

  describe("spend", function () {
    it("should spend ETH", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      await receiver.sendTransaction({ to: exchangeMockInstance.address, value: amount });

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 0,
          token: constants.AddressZero,
          tokenId,
          amount,
        },
      ]);

      await expect(tx).changeEtherBalances([exchangeMockInstance, receiver], [-amount, amount]);
    });

    it("should spend ERC20", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Simple");
      const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);

      await erc20Instance.mint(exchangeMockInstance.address, amount);

      await erc20Instance.connect(receiver).approve(exchangeMockInstance.address, amount);

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId,
          amount,
        },
      ]);

      await expect(tx).changeTokenBalances(erc20Instance, [exchangeMockInstance, receiver], [-amount, amount]);
    });

    it("should spend ERC721", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc721Factory = await ethers.getContractFactory("ERC721Simple");
      const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

      await erc721Instance.mintCommon(exchangeMockInstance.address, templateId);

      await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
      ]);

      const balance = await erc721Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should spend ERC998", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc998Factory = await ethers.getContractFactory("ERC998Simple");
      const erc998Instance = await erc998Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

      await erc998Instance.mintCommon(exchangeMockInstance.address, templateId);

      await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 3,
          token: erc998Instance.address,
          tokenId,
          amount,
        },
      ]);

      const balance = await erc998Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should spend ERC1155", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
      const erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

      await erc1155Instance.mint(exchangeMockInstance.address, tokenId, amount, "0x");

      await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 4,
          token: erc1155Instance.address,
          tokenId,
          amount,
        },
      ]);

      const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);
    });
  });
});
