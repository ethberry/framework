import { expect } from "chai";
import { ethers } from "hardhat";
import { deployErc721Base } from "../Exchange/shared/fixture";
import { METADATA_ROLE, MINTER_ROLE, amount } from "@gemunion/contracts-constants";
import { externalId, params, tokenId } from "../constants";
import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "../Exchange/shared/utils";
import { BigNumber, Contract, constants } from "ethers";
import { isEqualEventArgArrObj, isEqualEventArgObj } from "../utils";
import { deployDiamond } from "./fixture";

describe("Diamond Exchange Core", function () {
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

  it("should purchase", async function () {
    const [_owner, receiver] = await ethers.getSigners();

    const diamondInstance = await deployDiamond();
    const exchangeInstance = await ethers.getContractAt("ExchangePurchaseFacet", diamondInstance.address);
    const { generateOneToManySignature } = await getSignatures(exchangeInstance);
    const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

    await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);
    await erc721Instance.grantRole(METADATA_ROLE, exchangeInstance.address);

    const signature = await generateOneToManySignature({
      account: receiver.address,
      params,
      item: {
        tokenType: 2,
        token: erc721Instance.address,
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

    const tx1 = exchangeInstance.connect(receiver).purchase(
      params,
      {
        tokenType: 2,
        token: erc721Instance.address,
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
      { value: BigNumber.from("123000000000000000"), gasLimit: 500000 },
    );

    await expect(tx1)
      .to.emit(exchangeInstance, "Purchase")
      .withArgs(
        receiver.address,
        externalId,
        isEqualEventArgObj({
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: BigNumber.from(tokenId),
          amount: BigNumber.from(amount),
        }),
        isEqualEventArgArrObj({
          tokenType: 0,
          token: constants.AddressZero,
          tokenId: BigNumber.from("0"),
          amount: BigNumber.from("123000000000000000"),
        }),
      );
  });
});
