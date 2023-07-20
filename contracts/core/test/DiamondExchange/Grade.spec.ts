import { expect } from "chai";
import { ethers } from "hardhat";

import { deployErc20Base, deployErc721Base } from "../Exchange/shared/fixture";
import { amount, METADATA_ROLE } from "@gemunion/contracts-constants";
import { externalId, extra, params, templateId, tokenId } from "../constants";
import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "../Exchange/shared/utils";
import { Contract, ZeroAddress, ZeroHash } from "ethers";
import { isEqualEventArgArrObj, isEqualEventArgObj } from "../utils";
import { deployDiamond } from "./shared/fixture";

describe("Diamond Exchange Grade", function () {
  const factory = async () =>
    deployDiamond(
      "DiamondExchange",
      ["ExchangeGradeFacet", "PausableFacet", "AccessControlFacet", "WalletFacet"],
      "DiamondExchangeInit",
      {
        logSelectors: false,
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

  describe("upgrade", function () {
    it("should update metadata", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeGradeFacet", diamondAddress);
      const { generateOneToManySignature } = await getSignatures(diamondInstance as any);

      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Upgradeable", exchangeInstance);

      const tx1 = erc721Instance.mintCommon(receiver.address, templateId);

      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

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
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);

      const tx2 = exchangeInstance.connect(receiver).upgrade(
        params,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      // event Upgrade(address from, uint256 externalId, Asset item, Asset[] price);
      await expect(tx2)
        .to.emit(exchangeInstance, "Upgrade")
        .withArgs(
          receiver.address,
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount,
          }),
          isEqualEventArgArrObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          }),
        )
        .to.emit(erc721Instance, "LevelUp")
        .withArgs(await exchangeInstance.getAddress(), tokenId, extra, 1);
    });

    it("should fail: insufficient allowance", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeGradeFacet", diamondAddress);
      const { generateOneToManySignature } = await getSignatures(diamondInstance as any);

      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Upgradeable", exchangeInstance);

      const tx1 = erc721Instance.mintCommon(receiver.address, templateId);

      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

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
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(receiver.address, amount);
      // await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);

      const tx2 = exchangeInstance.connect(receiver).upgrade(
        params,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx2).to.be.revertedWith(`ERC20: insufficient allowance`);
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeGradeFacet", diamondAddress);
      const { generateOneToManySignature } = await getSignatures(diamondInstance as any);

      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Upgradeable", exchangeInstance);

      const tx1 = erc721Instance.mintCommon(receiver.address, templateId);

      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

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
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      // await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);

      const tx2 = exchangeInstance.connect(receiver).upgrade(
        params,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },

        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx2).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
    });

    it("should fail: invalid token ID", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeGradeFacet", diamondAddress);
      const { generateOneToManySignature } = await getSignatures(diamondInstance as any);

      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Upgradeable", exchangeInstance);

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
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);

      const tx2 = exchangeInstance.connect(receiver).upgrade(
        params,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },

        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx2).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("should fail: signer is missing role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const diamondInstance = await factory();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeGradeFacet", diamondAddress);
      const { generateOneToManySignature } = await getSignatures(diamondInstance as any);

      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Upgradeable", exchangeInstance);

      const tx1 = erc721Instance.mintCommon(receiver.address, templateId);

      await expect(tx1).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

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
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);

      const accessControlInstance = await ethers.getContractAt("AccessControlFacet", diamondAddress);
      await accessControlInstance.renounceRole(METADATA_ROLE, owner.address);

      const tx2 = exchangeInstance.connect(receiver).upgrade(
        params,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx2).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
    });
  });

  it("should fail: paused", async function () {
    const [_owner] = await ethers.getSigners();

    const diamondInstance = await factory();
    const diamondAddress = await diamondInstance.getAddress();

    const exchangeInstance = await ethers.getContractAt("ExchangeGradeFacet", diamondAddress);
    const pausableInstance = await ethers.getContractAt("PausableFacet", diamondAddress);
    await pausableInstance.pause();

    const tx1 = exchangeInstance.upgrade(
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
