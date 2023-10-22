import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, encodeBytes32String, toBeHex, ZeroAddress, ZeroHash, zeroPadValue } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { expiresAt, externalId, params, templateId, tokenId } from "../constants";
import { isEqualEventArgArrObj } from "../utils";
import { deployDiamond, deployErc721Base } from "./shared/fixture";
import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "./shared/utils";

describe("Diamond Exchange Merge", function () {
  const factory = async (facetName = "ExchangeMergeFacet"): Promise<any> => {
    const diamondInstance = await deployDiamond(
      "DiamondExchange",
      [facetName, "AccessControlFacet", "PausableFacet", "WalletFacet"],
      "DiamondExchangeInit",
      {
        logSelectors: false,
      },
    );
    return ethers.getContractAt(facetName, await diamondInstance.getAddress());
  };

  const getSignatures = async (contractInstance: Contract) => {
    const [owner] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    const generateOneToOneSignature = wrapOneToOneSignature(network, contractInstance, "EXCHANGE", owner);
    const generateOneToManySignature = wrapOneToManySignature(network, contractInstance, "EXCHANGE", owner);
    const generateManyToManySignature = wrapManyToManySignature(network, contractInstance, "EXCHANGE", owner);

    return {
      generateOneToOneSignature,
      generateOneToManySignature,
      generateManyToManySignature,
    };
  };

  describe("merge", function () {
    describe("ERC721 > ERC721", function () {
      it("should merge", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const tx01 = erc721Instance.mintCommon(receiver.address, templateId);
        await expect(tx01)
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId + 0n);
        await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId + 0n);

        const tx02 = erc721Instance.mintCommon(receiver.address, templateId);
        await expect(tx02)
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId + 1n);
        await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId + 1n);

        const tx03 = erc721Instance.mintCommon(receiver.address, templateId);
        await expect(tx03)
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId + 2n);
        await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId + 2n);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId,
            expiresAt,
            receiver: owner.address,
            referrer: ZeroAddress,
            extra: zeroPadValue(toBeHex(templateId), 32),
          },
          items: [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId: 2,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId: tokenId + 0n,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId: tokenId + 1n,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId: tokenId + 2n,
              amount: 1,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).merge(
          {
            nonce: encodeBytes32String("nonce"),
            externalId,
            expiresAt,
            receiver: owner.address,
            referrer: ZeroAddress,
            extra: zeroPadValue(toBeHex(templateId), 32),
          },
          [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId: 2,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId: tokenId + 0n,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId: tokenId + 1n,
              amount: 1,
            },
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId: tokenId + 2n,
              amount: 1,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Merge")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId: 2n,
              amount: 1n,
            }),
            isEqualEventArgArrObj(
              {
                tokenType: 2n,
                token: await erc721Instance.getAddress(),
                tokenId: tokenId + 0n,
                amount: 1n,
              },
              {
                tokenType: 2n,
                token: await erc721Instance.getAddress(),
                tokenId: tokenId + 1n,
                amount: 1n,
              },
              {
                tokenType: 2n,
                token: await erc721Instance.getAddress(),
                tokenId: tokenId + 2n,
                amount: 1n,
              },
            ),
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId + 3n)
          .to.emit(erc721Instance, "Transfer")
          .withArgs(receiver.address, ZeroAddress, tokenId + 0n)
          .to.emit(erc721Instance, "Transfer")
          .withArgs(receiver.address, ZeroAddress, tokenId + 1n)
          .to.emit(erc721Instance, "Transfer")
          .withArgs(receiver.address, ZeroAddress, tokenId + 2n);
      });
    });
  });

  describe("ERROR", function () {
    it("should fail: EnforcedPause", async function () {
      const [_owner] = await ethers.getSigners();

      const exchangeInstance = await factory();
      const pausableInstance = await ethers.getContractAt("PausableFacet", exchangeInstance);
      await pausableInstance.pause();

      const tx1 = exchangeInstance.merge(
        params,
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId,
            amount,
          },
        ],
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

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "EnforcedPause");
    });
  });
});
