import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, baseTokenURI, royalty, tokenName, tokenSymbol } from "@gemunion/contracts-constants";
import { templateId } from "../constants";

describe("ExchangeMock", function () {
  describe("spendFrom", function () {
    it("should spendFrom ERC20 Blacklist", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const oneEth = ethers.constants.WeiPerEther;

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Blacklist");
      const erc20Instance = await erc20Factory.deploy("TEST", "TEST", ethers.constants.WeiPerEther.mul(amount));

      await erc20Instance.mint(receiver.address, ethers.constants.WeiPerEther.mul("100"));

      await erc20Instance
        .connect(receiver)
        .approve(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul(amount));

      const tx = await exchangeMockInstance.connect(receiver).testSpendFrom([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.constants.WeiPerEther,
        },
      ]);

      await expect(tx).changeTokenBalances(erc20Instance, [receiver, exchangeMockInstance], [oneEth.mul(-1), oneEth]);
    });

    it("should spendFrom ETH", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const oneEth = ethers.constants.WeiPerEther;

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const tx = await exchangeMockInstance.connect(receiver).testSpendFrom(
        [
          {
            tokenType: 0,
            token: ethers.constants.AddressZero,
            tokenId: 0,
            amount: oneEth,
          },
        ],
        { value: oneEth },
      );

      await expect(tx).changeEtherBalances([receiver, exchangeMockInstance], [oneEth.mul(-1), oneEth]);
    });

    it("should spendFrom ERC721", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc721Factory = await ethers.getContractFactory("ERC721Simple");
      const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

      await erc721Instance.mintCommon(receiver.address, templateId);

      await erc721Instance.connect(receiver).approve(exchangeMockInstance.address, 1);

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

    it("should spendFrom ERC1155", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
      const erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

      await erc1155Instance.mint(receiver.address, 1, amount, "0x");

      await erc1155Instance.connect(receiver).setApprovalForAll(exchangeMockInstance.address, true);
      // await erc1155Instance.connect(receiver).approve(exchangeMockInstance.address, 1);

      await exchangeMockInstance.connect(receiver).testSpendFrom([
        {
          tokenType: 4,
          token: erc1155Instance.address,
          tokenId: 1,
          amount,
        },
      ]);

      const balance = await erc1155Instance.balanceOf(exchangeMockInstance.address, 1);
      expect(balance).to.equal(amount);
    });

    it("should spendFrom ERC998", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc998Factory = await ethers.getContractFactory("ERC998Simple");
      const erc998Instance = await erc998Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

      await erc998Instance.mintCommon(receiver.address, 1);
      await erc998Instance.connect(receiver).approve(exchangeMockInstance.address, templateId);

      await exchangeMockInstance.connect(receiver).testSpendFrom([
        {
          tokenType: 3,
          token: erc998Instance.address,
          tokenId: 1,
          amount,
        },
      ]);

      const balance = await erc998Instance.balanceOf(exchangeMockInstance.address);
      expect(balance).to.equal(1);
    });
  });

  describe("spend", function () {
    it("should spend ERC20 Blacklist", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Blacklist");
      const erc20Instance = await erc20Factory.deploy("TEST", "TEST", ethers.constants.WeiPerEther.mul(amount));

      await erc20Instance.mint(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul("100"));

      const oneEth = ethers.constants.WeiPerEther;

      await erc20Instance
        .connect(receiver)
        .approve(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul(amount));

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.constants.WeiPerEther,
        },
      ]);

      await expect(tx).changeTokenBalances(erc20Instance, [exchangeMockInstance, receiver], [oneEth.mul(-1), oneEth]);
    });

    it("should spend ETH", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const oneEth = ethers.constants.WeiPerEther;

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      await receiver.sendTransaction({ to: exchangeMockInstance.address, value: oneEth });

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 0,
          token: ethers.constants.AddressZero,
          tokenId: 0,
          amount: oneEth,
        },
      ]);

      await expect(tx).changeEtherBalances([exchangeMockInstance, receiver], [oneEth.mul(-1), oneEth]);
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
          tokenId: 1,
          amount,
        },
      ]);

      const balance = await erc721Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should spend ERC1155", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
      const erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

      await erc1155Instance.mint(exchangeMockInstance.address, 1, amount, "0x");

      // await erc1155Instance.connect(receiver).setApprovalForAll(exchangeMockInstance.address, true);
      // await erc1155Instance.connect(receiver).approve(exchangeMockInstance.address, 1);

      await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 4,
          token: erc1155Instance.address,
          tokenId: 1,
          amount,
        },
      ]);

      const balance = await erc1155Instance.balanceOf(receiver.address, 1);
      expect(balance).to.equal(amount);
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
          tokenId: 1,
          amount,
        },
      ]);

      const balance = await erc998Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });
  });
});
