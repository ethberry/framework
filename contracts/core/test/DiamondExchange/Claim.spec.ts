import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { deployDiamond, deployErc1155Base, deployErc20Base, deployErc721Base } from "./shared/fixture";
import { amount, MINTER_ROLE, nonce } from "@gemunion/contracts-constants";
import { expiresAt, externalId, extra, params, subscriptionId, tokenId } from "../constants";
import { wrapManyToManySignature, wrapOneToManySignature, wrapOneToOneSignature } from "./shared/utils";
import { Contract, encodeBytes32String, toBeHex, ZeroAddress, ZeroHash, zeroPadValue } from "ethers";
import { isEqualEventArgArrObj } from "../utils";
import { VRFCoordinatorMock } from "../../typechain-types";
import { deployLinkVrfFixture } from "../shared/link";
import { randomRequest } from "../shared/randomRequest";

describe("Diamond Exchange Claim", function () {
  const factory = async (facetName = "ExchangeClaimFacet"): Promise<any> => {
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

    const generateOneToOneSignature = wrapOneToOneSignature(network, contractInstance, "Exchange", owner);
    const generateOneToManySignature = wrapOneToManySignature(network, contractInstance, "Exchange", owner);
    const generateManyToManySignature = wrapManyToManySignature(network, contractInstance, "Exchange", owner);

    return {
      generateOneToOneSignature,
      generateOneToManySignature,
      generateManyToManySignature,
    };
  };

  let vrfInstance: VRFCoordinatorMock;

  before(async function () {
    await network.provider.send("hardhat_reset");

    // https://github.com/NomicFoundation/hardhat/issues/2980
    ({ vrfInstance } = await loadFixture(function exchange() {
      return deployLinkVrfFixture();
    }));
  });

  after(async function () {
    await network.provider.send("hardhat_reset");
  });

  describe("claim", function () {
    describe("ERC20", function () {
      it("should claim", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);

        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId,
            expiresAt,
            receiver: owner.address, // spender
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          {
            nonce: encodeBytes32String("nonce"),
            externalId,
            expiresAt,
            receiver: owner.address, // spender
            referrer: ZeroAddress,
            extra,
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

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            }),
          )
          .to.emit(erc20Instance, "Transfer")
          .withArgs(owner.address, receiver.address, amount);

        await expect(tx1).changeTokenBalances(erc20Instance, [owner, receiver], [-amount, amount]);

        const balance = await erc20Instance.balanceOf(receiver.address);
        expect(balance).to.equal(amount);
      });

      it("should claim (extra)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);

        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

        const extra = zeroPadValue(toBeHex(Math.ceil(new Date("2030-01-01T00:00:00.000Z").getTime() / 1000)), 32);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce,
            externalId,
            expiresAt,
            receiver: owner.address,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          {
            nonce,
            externalId,
            expiresAt,
            receiver: owner.address,
            referrer: ZeroAddress,
            extra,
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

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 1n,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            }),
          )
          .to.emit(erc20Instance, "Transfer")
          .withArgs(owner.address, receiver.address, amount);

        await expect(tx1).changeTokenBalances(erc20Instance, [owner, receiver], [-amount, amount]);

        const balance = await erc20Instance.balanceOf(receiver.address);
        expect(balance).to.equal(amount);
      });
    });

    describe("ERC721", function () {
      it("should claim (Simple)", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);

        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            }),
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ZeroAddress, receiver.address, tokenId);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should claim (Random)", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);

        const tx02 = await vrfInstance.addConsumer(subscriptionId, await erc721Instance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(subscriptionId, await erc721Instance.getAddress());

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId,
              amount,
            }),
          )
          .to.not.emit(erc721Instance, "Transfer");

        await randomRequest(erc721Instance, vrfInstance);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });
    });

    describe("ERC1155", function () {
      it("should claim", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);

        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 4,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          .withArgs(
            receiver.address,
            externalId,
            isEqualEventArgArrObj({
              tokenType: 4n,
              token: await erc1155Instance.getAddress(),
              tokenId,
              amount,
            }),
          )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(await exchangeInstance.getAddress(), ZeroAddress, receiver.address, tokenId, amount);

        const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
        expect(balance).to.equal(amount);
      });
    });

    describe("ERROR", function () {
      it("should fail: Expired signature 1", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);

        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce,
            externalId,
            expiresAt: 1,
            receiver: ZeroAddress,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          {
            nonce,
            externalId,
            expiresAt: 1,
            receiver: ZeroAddress,
            referrer: ZeroAddress,
            extra,
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

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });

      it("should fail: Expired signature 2", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);

        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce: encodeBytes32String("nonce"),
            externalId,
            expiresAt,
            receiver: owner.address, // spender
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          {
            nonce: encodeBytes32String("nonce"),
            externalId,
            expiresAt,
            receiver: owner.address, // spender
            referrer: ZeroAddress,
            extra,
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

        await expect(tx1).to.emit(exchangeInstance, "Claim");

        const tx2 = exchangeInstance.connect(receiver).claim(
          params,
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

        await expect(tx2).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });

      it("should fail: Expired signature 3", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);

        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

        const extra = zeroPadValue(toBeHex(Math.ceil(new Date("2000-01-01T00:00:00.000Z").getTime() / 1000)), 32);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params: {
            nonce,
            externalId,
            expiresAt,
            receiver: ZeroAddress,
            referrer: ZeroAddress,
            extra,
          },
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          {
            nonce,
            externalId,
            expiresAt,
            receiver: ZeroAddress,
            referrer: ZeroAddress,
            extra,
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

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });

      it("should fail: signer is missing role", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const exchangeInstance = await factory();
        const { generateManyToManySignature } = await getSignatures(exchangeInstance);

        const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const accessInstance = await ethers.getContractAt("AccessControlFacet", await exchangeInstance.getAddress());
        await accessInstance.renounceRole(MINTER_ROLE, owner.address);

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
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

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
      });

      it("should fail: paused", async function () {
        const diamondInstance = await factory();
        const diamondAddress = await diamondInstance.getAddress();

        const exchangeInstance = await ethers.getContractAt("ExchangeClaimFacet", diamondAddress);
        const pausableInstance = await ethers.getContractAt("PausableFacet", diamondAddress);
        await pausableInstance.pause();

        const tx1 = exchangeInstance.claim(
          params,
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
  });

  it("should fail: paused", async function () {
    const [owner, receiver] = await ethers.getSigners();

    const diamondInstance = await factory();
    const diamondAddress = await diamondInstance.getAddress();

    const exchangeInstance = await ethers.getContractAt("ExchangeClaimFacet", diamondAddress);
    const pausableInstance = await ethers.getContractAt("PausableFacet", diamondAddress);
    await pausableInstance.pause();

    const { generateManyToManySignature } = await getSignatures(diamondInstance);

    const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
    await erc20Instance.mint(owner.address, amount);
    await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

    const extra = zeroPadValue(toBeHex(Math.ceil(new Date("2030-01-01T00:00:00.000Z").getTime() / 1000)), 32);

    const signature = await generateManyToManySignature({
      account: receiver.address,
      params: {
        nonce,
        externalId,
        expiresAt,
        receiver: ZeroAddress,
        referrer: ZeroAddress,
        extra,
      },
      items: [
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId,
          amount,
        },
      ],
      price: [],
    });

    const tx1 = exchangeInstance.connect(receiver).claim(
      {
        nonce,
        externalId,
        expiresAt,
        receiver: ZeroAddress,
        referrer: ZeroAddress,
        extra,
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

    await expect(tx1).to.be.revertedWith("Pausable: paused");
  });
});
