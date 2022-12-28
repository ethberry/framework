import { expect } from "chai";
import { ethers, network } from "hardhat";
import { constants, BigNumber } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount, decimals, LINK_ADDR, params, tokenId, VRF_ADDR } from "../../constants";
import { deployErc1155Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { deployLinkVrfFixture } from "../../shared/link";
import { LinkErc20, VRFCoordinatorMock } from "../../../typechain-types";

describe("ExchangeClaim", function () {
  // shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  let linkInstance: LinkErc20;
  let vrfInstance: VRFCoordinatorMock;

  before(async function () {
    await network.provider.send("hardhat_reset");

    // https://github.com/NomicFoundation/hardhat/issues/2980
    ({ linkInstance, vrfInstance } = await loadFixture(function staking() {
      return deployLinkVrfFixture();
    }));

    expect(linkInstance.address).equal(LINK_ADDR);
    expect(vrfInstance.address).equal(VRF_ADDR);
  });

  after(async function () {
    await network.provider.send("hardhat_reset");
  });

  describe("claim", function () {
    describe("ERC721", function () {
      it("should claim ", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ethers.constants.AddressZero, receiver.address, tokenId);
      });

      it("should claim random", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance);

        await linkInstance.transfer(erc721Instance.address, BigNumber.from("1000").mul(decimals));

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).claim(
          params,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.not.emit(erc721Instance, "Transfer");
      });
    });

    describe("ERC1155", function () {
      it("should claim", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const erc1155Instance = await deployErc1155Base("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
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
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Claim")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, constants.AddressZero, receiver.address, tokenId, amount);
      });
    });
  });
});
