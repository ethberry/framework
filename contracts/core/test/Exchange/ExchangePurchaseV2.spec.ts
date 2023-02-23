import { expect } from "chai";
import { ethers, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount } from "@gemunion/contracts-constants";
import { params, tokenId } from "../constants";

import { deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { deployLinkVrfFixtureV2 } from "../shared/link";
import { IERC721Random, VRFCoordinatorV2Mock } from "../../typechain-types";
import { deployERC20 } from "../ERC20/shared/fixtures";
import { randomRequestV2 } from "../shared/randomRequest";

describe("ExchangePurchaseV2", function () {
  let vrfInstance: VRFCoordinatorV2Mock;

  before(async function () {
    await network.provider.send("hardhat_reset");

    // https://github.com/NomicFoundation/hardhat/issues/2980
    ({ vrfInstance } = await loadFixture(function exchange() {
      return deployLinkVrfFixtureV2();
    }));
  });

  after(async function () {
    await network.provider.send("hardhat_reset");
  });

  describe("exchange", function () {
    describe("exchange purchase", function () {
      it("should purchase ERC721 Random for ERC20", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
        const erc721Instance = await deployErc721Base("ERC721RandomHardhat", exchangeInstance.address);
        const erc20Instance = await deployERC20("ERC20Simple");
        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        // addConsumer to VRFCOORDINATOR
        const tx02 = vrfInstance.addConsumer(1, erc721Instance.address);

        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721Instance.address);
        const signature = await generateOneToManySignature({
          account: receiver.address,
          params,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).purchase(
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount: amount,
            },
          ],
          signature,
        );

        await expect(tx1).to.emit(exchangeInstance, "Purchase");

        await randomRequestV2(erc721Instance as IERC721Random, vrfInstance);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });
    });
  });
});
