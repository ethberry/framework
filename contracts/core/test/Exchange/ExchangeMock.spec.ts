import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "@gemunion/contracts-constants";

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

    it("should spendFrom 3 asset of ERC20 Blacklist", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Blacklist");
      const erc20Instance = await erc20Factory.deploy("TEST", "TEST", ethers.constants.WeiPerEther.mul(amount));

      await erc20Instance.mint(receiver.address, ethers.constants.WeiPerEther.mul("100"));

      const amounts = [1, 3, 2];
      const totalAmounts = amounts.reduce((prev, curent) => prev + curent);

      await erc20Instance
        .connect(receiver)
        .approve(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul(amount));

      const tx = await exchangeMockInstance.connect(receiver).testSpendFrom([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[0].toString()),
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[1].toString()),
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[2].toString()),
        },
      ]);

      await expect(tx).changeTokenBalances(
        erc20Instance,
        [receiver, exchangeMockInstance],
        [ethers.utils.parseEther(totalAmounts.toString()).mul(-1), ethers.utils.parseEther(totalAmounts.toString())],
      );
    });

    it("should spendFrom 3 asset of ETH", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const amounts = [1, 0.5, 2];
      const totalAmounts = amounts.reduce((prev, curent) => prev + curent);

      const tx = await exchangeMockInstance.connect(receiver).testSpendFrom(
        [
          {
            tokenType: 0,
            token: ethers.constants.AddressZero,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[0].toString()),
          },
          {
            tokenType: 0,
            token: ethers.constants.AddressZero,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[1].toString()),
          },
          {
            tokenType: 0,
            token: ethers.constants.AddressZero,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[2].toString()),
          },
        ],
        { value: ethers.utils.parseEther(totalAmounts.toString()) },
      );

      await expect(tx).changeEtherBalances(
        [receiver, exchangeMockInstance],
        [ethers.utils.parseEther(totalAmounts.toString()).mul(-1), ethers.utils.parseEther(totalAmounts.toString())],
      );
    });

    it("should spendFrom 3 asset of ETH & ERC20 Blacklist", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Blacklist");
      const erc20Instance = await erc20Factory.deploy("TEST", "TEST", ethers.constants.WeiPerEther.mul(amount));

      await erc20Instance.mint(receiver.address, ethers.constants.WeiPerEther.mul("100"));

      const amounts = [1, 3, 2];
      const totalAmounts = amounts.reduce((prev, curent) => prev + curent);

      await erc20Instance
        .connect(receiver)
        .approve(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul(amount));

      const tx = await exchangeMockInstance.connect(receiver).testSpendFrom(
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[0].toString()),
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[1].toString()),
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[2].toString()),
          },
          {
            tokenType: 0,
            token: ethers.constants.AddressZero,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[0].toString()),
          },
          {
            tokenType: 0,
            token: ethers.constants.AddressZero,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[1].toString()),
          },
          {
            tokenType: 0,
            token: ethers.constants.AddressZero,
            tokenId: 0,
            amount: ethers.utils.parseEther(amounts[2].toString()),
          },
        ],
        { value: ethers.utils.parseEther(totalAmounts.toString()) },
      );

      await expect(tx).changeTokenBalances(
        erc20Instance,
        [receiver, exchangeMockInstance],
        [ethers.utils.parseEther(totalAmounts.toString()).mul(-1), ethers.utils.parseEther(totalAmounts.toString())],
      );

      await expect(tx).changeEtherBalances(
        [receiver, exchangeMockInstance],
        [ethers.utils.parseEther(totalAmounts.toString()).mul(-1), ethers.utils.parseEther(totalAmounts.toString())],
      );
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

    it("should spend 3 asset of ERC20 Blacklist", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Blacklist");
      const erc20Instance = await erc20Factory.deploy("TEST", "TEST", ethers.constants.WeiPerEther.mul(amount));

      await erc20Instance.mint(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul("100"));

      const amounts = [1, 3, 2];
      const totalAmounts = amounts.reduce((prev, curent) => prev + curent);

      await erc20Instance
        .connect(receiver)
        .approve(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul(amount));

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[0].toString()),
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[1].toString()),
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[2].toString()),
        },
      ]);

      await expect(tx).changeTokenBalances(
        erc20Instance,
        [exchangeMockInstance, receiver],
        [ethers.utils.parseEther(totalAmounts.toString()).mul(-1), ethers.utils.parseEther(totalAmounts.toString())],
      );
    });

    it("should spend 3 asset of ETH", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const amounts = [1, 0.5, 2];
      const totalAmounts = amounts.reduce((prev, curent) => prev + curent);

      await receiver.sendTransaction({
        to: exchangeMockInstance.address,
        value: ethers.utils.parseEther(totalAmounts.toString()),
      });

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 0,
          token: ethers.constants.AddressZero,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[0].toString()),
        },
        {
          tokenType: 0,
          token: ethers.constants.AddressZero,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[1].toString()),
        },
        {
          tokenType: 0,
          token: ethers.constants.AddressZero,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[2].toString()),
        },
      ]);

      await expect(tx).changeEtherBalances(
        [exchangeMockInstance, receiver],
        [ethers.utils.parseEther(totalAmounts.toString()).mul(-1), ethers.utils.parseEther(totalAmounts.toString())],
      );
    });

    it("should spend 3 asset of ETH & ERC20 Blacklist", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const exchangeMockFactory = await ethers.getContractFactory("ExchangeMock");
      const exchangeMockInstance = await exchangeMockFactory.deploy();

      const erc20Factory = await ethers.getContractFactory("ERC20Blacklist");
      const erc20Instance = await erc20Factory.deploy("TEST", "TEST", ethers.constants.WeiPerEther.mul(amount));

      await erc20Instance.mint(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul("100"));

      const amounts = [1, 3, 2];
      const totalAmounts = amounts.reduce((prev, curent) => prev + curent);

      await receiver.sendTransaction({
        to: exchangeMockInstance.address,
        value: ethers.utils.parseEther(totalAmounts.toString()),
      });

      await erc20Instance
        .connect(receiver)
        .approve(exchangeMockInstance.address, ethers.constants.WeiPerEther.mul(amount));

      const tx = await exchangeMockInstance.connect(receiver).testSpend([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[0].toString()),
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[1].toString()),
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[2].toString()),
        },
        {
          tokenType: 0,
          token: ethers.constants.AddressZero,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[0].toString()),
        },
        {
          tokenType: 0,
          token: ethers.constants.AddressZero,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[1].toString()),
        },
        {
          tokenType: 0,
          token: ethers.constants.AddressZero,
          tokenId: 0,
          amount: ethers.utils.parseEther(amounts[2].toString()),
        },
      ]);

      await expect(tx).changeTokenBalances(
        erc20Instance,
        [exchangeMockInstance, receiver],
        [ethers.utils.parseEther(totalAmounts.toString()).mul(-1), ethers.utils.parseEther(totalAmounts.toString())],
      );

      await expect(tx).changeEtherBalances(
        [exchangeMockInstance, receiver],
        [ethers.utils.parseEther(totalAmounts.toString()).mul(-1), ethers.utils.parseEther(totalAmounts.toString())],
      );
    });
  });
});
