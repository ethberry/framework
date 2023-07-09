import { expect } from "chai";
import { ethers } from "hardhat";
import { deployErc721Base } from "../Exchange/shared/fixture";
import { amount, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { externalId, params, tokenId } from "../constants";
import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "../Exchange/shared/utils";
import { Contract, toBigInt, ZeroAddress, ZeroHash } from "ethers";
import { isEqualEventArgArrObj, isEqualEventArgObj } from "../utils";
import { deployDiamond } from "./fixture";
import { blockAwait } from "@gemunion/contracts-utils";

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

    const generateOneToOneSignature = wrapOneToOneSignature(network, contractInstance, owner);
    const generateOneToManySignature = wrapOneToManySignature(network, contractInstance, owner);
    const generateManyToManySignature = wrapManyToManySignature(network, contractInstance, owner);

    return {
      generateOneToOneSignature,
      generateOneToManySignature,
      generateManyToManySignature,
    };
  };

  it.only("should purchase", async function () {
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
      params,
      item: {
        tokenType: 2,
        token: await erc721Instance.getAddress(),
        tokenId,
        amount,
      },
      price: [
        {
          amount: "123000000000000000",
          token: "0x0000000000000000000000000000000000000000",
          tokenId: "0",
          tokenType: 0,
        },
      ],
    });

    await blockAwait(2, 100);
    const tx1 = await exchangeInstance.connect(receiver).purchase(
      params,
      {
        tokenType: 2,
        token: await erc721Instance.getAddress(),
        tokenId,
        amount,
      },
      [
        {
          amount: "123000000000000000",
          token: "0x0000000000000000000000000000000000000000",
          tokenId: "0",
          tokenType: 0,
        },
      ],
      signature,
      { value: toBigInt("123000000000000000"), gasLimit: 500000 },
    );
    console.log("tx1.hash", tx1.hash);
    // await expect(tx1).to.emit(exchangeInstance, "Purchase");
    // .withArgs(
    //   receiver.address,
    //   externalId,
    //   isEqualEventArgObj({
    //     tokenType: "2",
    //     token: await erc721Instance.getAddress(),
    //     tokenId: toBigInt(tokenId),
    //     amount: toBigInt(amount),
    //   }),
    //   isEqualEventArgArrObj({
    //     tokenType: "0",
    //     token: ZeroAddress,
    //     tokenId: toBigInt("0"),
    //     amount: toBigInt("123000000000000000"),
    //   }),
    // );
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
