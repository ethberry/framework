import { expect } from "chai";
import { ethers, network } from "hardhat";
import { amount, MINTER_ROLE } from "@gemunion/contracts-constants";
import { expiresAt, externalId, extra } from "../constants";
import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "../Exchange/shared/utils";
import { Contract, encodeBytes32String, parseEther, ZeroAddress, ZeroHash } from "ethers";
import { getContractName, isEqualEventArgObj } from "../utils";
import { deployDiamond } from "./fixture";
import { deployERC20 } from "../ERC20/shared/fixtures";
import { deployERC721 } from "../ERC721/shared/fixtures";

describe("Diamond Exchange Raffle", function () {
  const factory = async () =>
    deployDiamond(
      "DiamondExchange",
      [
        "ExchangeRaffleFacet",
        "PausableFacet",
        "AccessControlFacet",
        "WalletFacet", //
      ],
      "DiamondExchangeInit",
      {
        // log: true,
        logSelectors: false, //
      },
    );

  const getSignatures = async (contractInstance: Contract, contractName: string) => {
    const [owner] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    const generateOneToOneSignature = wrapOneToOneSignature(network, contractInstance, contractName, owner);
    const generateOneToManySignature = wrapOneToManySignature(network, contractInstance, contractName, owner);
    const generateManyToManySignature = wrapManyToManySignature(network, contractInstance, contractName, owner);

    return {
      generateOneToOneSignature,
      generateOneToManySignature,
      generateManyToManySignature,
    };
  };

  describe("Purchase", function () {
    it("should purchase Raffle ticket", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const raffleConfig = {
        timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
        commission: 30, // lottery wallet gets 30% commission from each round balance
      };

      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);
      const { generateOneToOneSignature } = await getSignatures(diamondInstance as any, "Exchange");

      const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
      const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

      const raffleFactory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
      const raffleInstance: any = await raffleFactory.deploy(raffleConfig);

      await raffleInstance.startRound(
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        0, // maxTicket count
      );

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721TicketInstance.grantRole(MINTER_ROLE, raffleInstance.getAddress());

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        item: {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
      });

      const tx1 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );

      // event PurchaseRaffle(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, uint256 index);
      await expect(tx1)
        .to.emit(exchangeInstance, "PurchaseRaffle")
        .withArgs(
          receiver.address,
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount: amount * 1n,
          }),
          1n, // roundId
          1n, // ticket indexId
        );

      const balance = await erc20Instance.balanceOf(raffleInstance.getAddress());
      expect(balance).to.equal(amount * 1n);
    });

    it("should fail: not exist", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const raffleConfig = {
        timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
        commission: 30, // lottery wallet gets 30% commission from each round balance
      };

      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);
      const { generateOneToOneSignature } = await getSignatures(diamondInstance as any, "Exchange");

      const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
      const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

      const raffleFactory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
      const raffleInstance: any = await raffleFactory.deploy(raffleConfig);

      await raffleInstance.startRound(
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        0, // maxTicket count
      );

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721TicketInstance.grantRole(MINTER_ROLE, raffleInstance.getAddress());

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: ZeroAddress,
          referrer: ZeroAddress,
          extra,
        },
        item: {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
      });

      const tx1 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: ZeroAddress,
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "NotExist");
    });

    it("should fail: wrong token", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);
      const { generateOneToOneSignature } = await getSignatures(diamondInstance as any, "Exchange");
      const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
      const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

      const raffleFactory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
      const raffleConfig = {
        timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
        commission: 30, // lottery wallet gets 30% commission from each round balance
      };
      const raffleInstance: any = await raffleFactory.deploy(raffleConfig);
      await raffleInstance.startRound(
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 1,
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

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721TicketInstance.grantRole(MINTER_ROLE, raffleInstance.getAddress());

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        item: {
          tokenType: 0n,
          token: ZeroAddress,
          tokenId: 0,
          amount,
        },
        price: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
      });

      const tx1 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 0n,
          token: ZeroAddress,
          tokenId: 0,
          amount,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongToken");
    });

    it("should fail: wrong signer", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);
      const { generateOneToOneSignature } = await getSignatures(diamondInstance as any, "Exchange");
      const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
      const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

      const raffleFactory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
      const raffleConfig = {
        timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
        commission: 30, // lottery wallet gets 30% commission from each round balance
      };
      const raffleInstance: any = await raffleFactory.deploy(raffleConfig);
      await raffleInstance.startRound(
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        0, // maxTicket count
      );

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721TicketInstance.grantRole(MINTER_ROLE, raffleInstance.getAddress());

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId: 101,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        item: {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
      });
      const tx1 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
    });

    it("should fail: wrong signature", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);

      const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
      const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

      const raffleFactory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
      const raffleConfig = {
        timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
        commission: 30, // lottery wallet gets 30% commission from each round balance
      };
      const raffleInstance: any = await raffleFactory.deploy(raffleConfig);
      await raffleInstance.startRound(
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        0, // maxTicket count
      );

      const signature = encodeBytes32String("signature");

      const tx = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );
      await expect(tx).to.be.revertedWith("ECDSA: invalid signature length");
    });

    it("should fail: expired signature", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);
      const { generateOneToOneSignature } = await getSignatures(diamondInstance as any, "Exchange");
      const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
      const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

      const raffleFactory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
      const raffleConfig = {
        timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
        commission: 30, // lottery wallet gets 30% commission from each round balance
      };
      const raffleInstance: any = await raffleFactory.deploy(raffleConfig);
      await raffleInstance.startRound(
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        0, // maxTicket count
      );

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721TicketInstance.grantRole(MINTER_ROLE, raffleInstance.getAddress());

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        item: {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
      });
      const tx1 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );

      await expect(tx1)
        .to.emit(exchangeInstance, "PurchaseRaffle")
        .withArgs(
          receiver.address,
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721TicketInstance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 121n,
            amount: amount * 1n,
          }),
          1n,
          1n,
        );

      const tx2 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );
      await expect(tx2).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
    });

    it("should fail: insufficient allowance", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);
      const { generateOneToOneSignature } = await getSignatures(diamondInstance as any, "Exchange");
      const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
      const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

      const raffleFactory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
      const raffleConfig = {
        timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
        commission: 30, // lottery wallet gets 30% commission from each round balance
      };
      const raffleInstance: any = await raffleFactory.deploy(raffleConfig);
      await raffleInstance.startRound(
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        0, // maxTicket count
      );

      await erc20Instance.mint(receiver.address, amount);
      // await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721TicketInstance.grantRole(MINTER_ROLE, raffleInstance.getAddress());

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        item: {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
      });
      const tx1 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );
      await expect(tx1).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);
      const { generateOneToOneSignature } = await getSignatures(diamondInstance as any, "Exchange");
      const erc20Instance = await deployERC20("ERC20Simple", { amount: parseEther("200000") });
      const erc721TicketInstance = await deployERC721("ERC721RaffleTicket");

      const raffleFactory = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));
      const raffleConfig = {
        timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
        commission: 30, // lottery wallet gets 30% commission from each round balance
      };
      const raffleInstance: any = await raffleFactory.deploy(raffleConfig);
      await raffleInstance.startRound(
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        0, // maxTicket count
      );

      await erc20Instance.mint(receiver.address, 1);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721TicketInstance.grantRole(MINTER_ROLE, raffleInstance.getAddress());

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        item: {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
      });
      const tx1 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: encodeBytes32String("nonce"),
          externalId,
          expiresAt,
          receiver: await raffleInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2n,
          token: await erc721TicketInstance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 121,
          amount,
        },
        signature,
      );

      await expect(tx1).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });

  it("should fail: paused", async function () {
    const diamondInstance = await factory();
    const diamondAddress = await diamondInstance.getAddress();

    const exchangeInstance = await ethers.getContractAt("ExchangeRaffleFacet", diamondAddress);
    const pausableInstance = await ethers.getContractAt("PausableFacet", diamondAddress);

    await pausableInstance.pause();

    const tx1 = exchangeInstance.purchaseRaffle(
      {
        externalId,
        expiresAt,
        nonce: encodeBytes32String("nonce"),
        extra,
        receiver: ZeroAddress,
        referrer: ZeroAddress,
      },
      {
        tokenType: 2n,
        token: ZeroAddress,
        tokenId: 0,
        amount: 1,
      },
      {
        tokenType: 1n,
        token: ZeroAddress,
        tokenId: 121n,
        amount,
      },
      ZeroHash,
    );

    await expect(tx1).to.be.revertedWith("Pausable: paused");
  });
});
