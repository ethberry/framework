import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { amount, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

describe("ExchangeMock", function () {
  describe("spendFrom", function () {
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
  });

  describe("spend", function () {
    it("should spend ERC20", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Simple");
      const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);

      await erc20Instance.mint(exchangeMockInstance.address, amount);

      await erc20Instance.connect(receiver).approve(exchangeMockInstance.address, constants.WeiPerEther.mul(amount));

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      ]);

      await expect(tx).changeTokenBalances(erc20Instance, [exchangeMockInstance, receiver], [-amount, amount]);
    });

    it("should spend ETH", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      await receiver.sendTransaction({ to: exchangeMockInstance.address, value: amount });

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 0,
          token: constants.AddressZero,
          tokenId: 0,
          amount,
        },
      ]);

      await expect(tx).changeEtherBalances([exchangeMockInstance, receiver], [-amount, amount]);
    });
  });
});
