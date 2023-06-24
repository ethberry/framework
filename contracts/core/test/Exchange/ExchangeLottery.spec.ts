import { expect } from "chai";
import { ethers, network } from "hardhat";
import { encodeBytes32String, parseEther, ZeroAddress } from "ethers";

import { amount, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC721 } from "../ERC721/shared/fixtures";
import { deployERC20 } from "../ERC20/shared/fixtures";
import { getContractName, isEqualEventArgArrObj, isEqualEventArgObj } from "../utils";
import { expiresAt, externalId, extra, params } from "../constants";
import { deployExchangeFixture } from "./shared/fixture";

describe("ExchangeLottery", function () {
  describe("Lottery", function () {
    describe("Purchase", function () {
      it("should purchase lottery ticket", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance: any = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n,
            amount,
          },
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          0, // maxTicket count
        );

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId: 121n,
              amount,
            },
          ],
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: encodeBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          signature,
        );

        // PurchaseLottery(address account, uint256 externalId, Asset[] items, Asset price, uint256 roundId, bytes32 numbers);
        await expect(tx1)
          .to.emit(exchangeInstance, "PurchaseLottery")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj(
              {
                tokenType: 0n,
                token: await lotteryInstance.getAddress(),
                tokenId: 0n,
                amount: 0n,
              },
              {
                tokenType: 2n,
                token: await erc721TicketInstance.getAddress(),
                tokenId: 1n, // ticketId = 1
                amount: 1n,
              },
            ),
            isEqualEventArgObj({
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId: 121n,
              amount: amount * 1n,
            }),
            1n,
            params.extra,
          );

        const balance = await erc20Instance.balanceOf(lotteryInstance.getAddress());
        expect(balance).to.equal(amount * 1n);
      });

      it("should fail: wrong amount", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance: any = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n,
            amount,
          },
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 122,
            amount,
          },
          0, // maxTicket count
        );

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          items: [],
          price: [
            {
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId: 121n,
              amount,
            },
          ],
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: encodeBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          [],
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongAmount");
      });

      it("should fail: wrong signer", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance: any = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n,
            amount,
          },
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          0, // maxTicket count
        );

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

        await lotteryInstance.grantRole(MINTER_ROLE, await exchangeInstance.getAddress());
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId: 1, // wtf?
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId: 121n,
              amount,
            },
          ],
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: encodeBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
      });

      it("should fail: wrong signature", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance /* generateManyToManySignature */ } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance: any = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n,
            amount,
          },
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          0, // maxTicket count
        );

        const signature = encodeBytes32String("signature");

        const tx = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: encodeBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          signature,
        );
        await expect(tx).to.be.revertedWith("ECDSA: invalid signature length");
      });

      it("should fail: expired signature", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance: any = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n,
            amount,
          },
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          0, // maxTicket count
        );

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId: 121n,
              amount,
            },
          ],
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: encodeBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          signature,
        );
        // event PurchaseLottery(address account, Asset item, Asset price, uint256 round, bytes32 numbers);
        await expect(tx1)
          .to.emit(exchangeInstance, "PurchaseLottery")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj(
              {
                tokenType: 0n,
                token: await lotteryInstance.getAddress(),
                tokenId: 0n,
                amount: 0n,
              },
              {
                tokenType: 2n,
                token: await erc721TicketInstance.getAddress(),
                tokenId: 1n, // ticketId = 1
                amount: 1n,
              },
            ),
            isEqualEventArgObj({
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId: 121n,
              amount: amount * 1n,
            }),
            1n,
            params.extra,
          );

        const tx2 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: encodeBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          signature,
        );
        await expect(tx2).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });

      it("should fail: insufficient allowance", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance: any = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n,
            amount,
          },
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          0, // maxTicket count
        );

        await erc20Instance.mint(receiver.address, amount);
        // await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId: 121n,
              amount,
            },
          ],
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: encodeBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          signature,
        );
        await expect(tx1).to.be.revertedWith("ERC20: insufficient allowance");
      });

      it("should fail: transfer amount exceeds balance", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance: any = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n,
            amount,
          },
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          0, // maxTicket count
        );

        await erc20Instance.mint(receiver.address, 1);
        await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId: 121n,
              amount,
            },
          ],
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: encodeBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: ZeroAddress,
            extra,
          },
          [
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0,
              amount: 0,
            },
            {
              tokenType: 2n,
              token: await erc721TicketInstance.getAddress(),
              tokenId: 0,
              amount: 1,
            },
          ],
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount,
          },
          signature,
        );

        await expect(tx1).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });
    });
  });
});
