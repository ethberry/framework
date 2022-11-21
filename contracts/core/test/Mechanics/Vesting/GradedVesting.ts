import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { time } from "@openzeppelin/test-helpers";

import { shouldBehaveLikeOwnable } from "@gemunion/contracts-mocha";
import { amount, span } from "@gemunion/contracts-constants";

import { deployERC20, deployVesting } from "./shared/fixture";

describe("GradedVesting", function () {
  const factory = () => deployVesting(this.title);

  shouldBehaveLikeOwnable(factory);

  it("should release ETH", async function () {
    const [owner] = await ethers.getSigners();
    const vestingInstance = await factory();

    const expectedAmounts = [0, amount * 10, amount * 20, amount * 30, amount * 40, 0];

    for (const expectedAmount of expectedAmounts) {
      const releaseable = await vestingInstance["releaseable()"]();
      expect(releaseable).to.be.equal(expectedAmount);

      const tx = await vestingInstance["release()"]();
      await expect(tx).changeEtherBalances([vestingInstance, owner], [releaseable.mul(-1), releaseable]);

      const current = await time.latest();
      await time.increaseTo(current.add(web3.utils.toBN(span)));
    }
  });

  it("should release ERC20", async function () {
    const [owner] = await ethers.getSigners();
    const vestingInstance = await deployVesting("GradedVesting");
    const erc20Instance = await deployERC20(vestingInstance);

    const expectedAmounts = [0, amount * 10, amount * 20, amount * 30, amount * 40, 0];

    for (const expectedAmount of expectedAmounts) {
      const releaseable = await vestingInstance["releaseable(address)"](erc20Instance.address);
      expect(releaseable).to.be.equal(expectedAmount);

      const tx = await vestingInstance["release(address)"](erc20Instance.address);
      await expect(tx).changeTokenBalances(
        erc20Instance,
        [vestingInstance.address, owner.address],
        [releaseable.mul(-1), releaseable],
      );

      const current = await time.latest();
      await time.increaseTo(current.add(web3.utils.toBN(span)));
    }
  });
});
