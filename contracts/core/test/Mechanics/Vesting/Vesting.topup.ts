import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeOwnable } from "@gemunion/contracts-mocha";
import { amount, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

import { deployVesting } from "./shared/fixture";

describe("Vesting TopUp", function () {
  const factory = () => deployVesting("LinearVesting");

  shouldBehaveLikeOwnable(factory);

  describe("topUp", function () {
    it("LinearVesting", async function () {
      const [owner] = await ethers.getSigners();
      const vestingInstance = await deployVesting("LinearVesting");

      const erc20Factory = await ethers.getContractFactory("ERC20Simple");
      const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);
      await erc20Instance.mint(owner.address, amount);

      await erc20Instance.approve(vestingInstance.address, amount);

      const tx = await vestingInstance.topUp([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      ]);

      await expect(tx)
        .to.emit(vestingInstance, "TransferReceived")
        .withArgs(vestingInstance.address, owner.address, amount, "0x");

      await expect(tx).changeTokenBalances(erc20Instance, [owner, vestingInstance], [-amount, amount]);
    });
  });
});
