import { expect } from "chai";
import { ethers } from "hardhat";
import { deployErc721Base } from "../Exchange/shared/fixture";
import { amount, nonce, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { expiresAt, externalId, extra, params, tokenId } from "../constants";
import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "../Exchange/shared/utils";
import { Contract, toBigInt, ZeroAddress, ZeroHash } from "ethers";
import { isEqualEventArgArrObj, isEqualEventArgObj } from "../utils";
import { deployDiamond } from "./fixture";

describe("Diamond Exchange Core", function () {
  const factory = async () =>
    deployDiamond(
      "DiamondExchange",
      [
        "ExchangePurchaseFacet",
        "ExchangeClaimFacet",
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

  const getSignatures = async (contractInstance: Contract) => {
    const [owner] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    const generateOneToOneSignature = wrapOneToOneSignature(network, contractInstance, "Exchange", owner);
    const generateOneToManySignature = wrapOneToManySignature(network, contractInstance, "Exchange", owner);
    const generateManyToManySignature = wrapManyToManySignature(network, contractInstance, "Exchange", owner);

    return {
      generateOneToOneSignature,
      generateOneToManySignature,
      generateManyToManySignature,
    };
  };

  it("should purchase", async function () {
    const [_owner, receiver] = await ethers.getSigners();

    const diamondInstance = await factory();
    const diamondAddress = await diamondInstance.getAddress();

    const exchangeInstance = await ethers.getContractAt("ExchangePurchaseFacet", diamondAddress);
    const { generateOneToManySignature } = await getSignatures(diamondInstance as any);
    const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

    await erc721Instance.grantRole(MINTER_ROLE, diamondAddress);
    await erc721Instance.grantRole(METADATA_ROLE, diamondAddress);

    const signature = await generateOneToManySignature({
      account: receiver.address,
      params: {
        externalId,
        expiresAt,
        nonce,
        extra,
        receiver: await exchangeInstance.getAddress(),
        referrer: ZeroAddress,
      },
      item: {
        tokenType: 2,
        token: await erc721Instance.getAddress(),
        tokenId,
        amount,
      },
      price: [
        {
          amount,
          token: "0x0000000000000000000000000000000000000000",
          tokenId: "0",
          tokenType: 0,
        },
      ],
    });

    const tx1 = exchangeInstance.connect(receiver).purchase(
      {
        externalId,
        expiresAt,
        nonce,
        extra,
        receiver: await exchangeInstance.getAddress(),
        referrer: ZeroAddress,
      },
      {
        tokenType: 2,
        token: await erc721Instance.getAddress(),
        tokenId,
        amount,
      },
      [
        {
          amount,
          token: "0x0000000000000000000000000000000000000000",
          tokenId: "0",
          tokenType: 0,
        },
      ],
      signature,
      { value: amount, gasLimit: 500000 },
    );

    await expect(tx1)
      .to.emit(exchangeInstance, "Purchase")
      .withArgs(
        receiver.address,
        externalId,
        isEqualEventArgObj({
          tokenType: "2",
          token: await erc721Instance.getAddress(),
          tokenId: toBigInt(tokenId),
          amount: toBigInt(amount),
        }),
        isEqualEventArgArrObj({
          tokenType: "0",
          token: ZeroAddress,
          tokenId: toBigInt("0"),
          amount,
        }),
      );

    await expect(tx1).to.changeEtherBalances([receiver, exchangeInstance], [-amount, amount]);
  });

  it("should fail: receiver not exist", async function () {
    const [_owner, receiver] = await ethers.getSigners();

    const diamondInstance = await factory();
    const diamondAddress = await diamondInstance.getAddress();

    const exchangeInstance = await ethers.getContractAt("ExchangePurchaseFacet", diamondAddress);
    const { generateOneToManySignature } = await getSignatures(diamondInstance as any);
    const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

    await erc721Instance.grantRole(MINTER_ROLE, diamondAddress);
    await erc721Instance.grantRole(METADATA_ROLE, diamondAddress);

    const signature = await generateOneToManySignature({
      account: receiver.address,
      params: {
        externalId,
        expiresAt,
        nonce,
        extra,
        receiver: ZeroAddress,
        referrer: ZeroAddress,
      },
      item: {
        tokenType: 2,
        token: await erc721Instance.getAddress(),
        tokenId,
        amount,
      },
      price: [
        {
          amount,
          token: "0x0000000000000000000000000000000000000000",
          tokenId: "0",
          tokenType: 0,
        },
      ],
    });

    const tx1 = exchangeInstance.connect(receiver).purchase(
      {
        externalId,
        expiresAt,
        nonce,
        extra,
        receiver: ZeroAddress,
        referrer: ZeroAddress,
      },
      {
        tokenType: 2,
        token: await erc721Instance.getAddress(),
        tokenId,
        amount,
      },
      [
        {
          amount,
          token: "0x0000000000000000000000000000000000000000",
          tokenId: "0",
          tokenType: 0,
        },
      ],
      signature,
      { value: amount, gasLimit: 500000 },
    );

    await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "NotExist");
  });

  it("should fail: paused", async function () {
    const diamondInstance = await factory();
    const diamondAddress = await diamondInstance.getAddress();

    const exchangeInstance = await ethers.getContractAt("ExchangePurchaseFacet", diamondAddress);
    const pausableInstance = await ethers.getContractAt("PausableFacet", diamondAddress);

    await pausableInstance.pause();

    const tx1 = exchangeInstance.purchase(
      params,
      {
        tokenType: 0,
        token: ZeroAddress,
        tokenId,
        amount,
      },
      [
        {
          tokenType: 0,
          token: ZeroAddress,
          tokenId,
          amount,
        },
      ],
      ZeroHash,
    );

    await expect(tx1).to.be.revertedWith("Pausable: paused");
  });
});
