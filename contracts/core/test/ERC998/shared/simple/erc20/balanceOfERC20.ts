import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { templateId } from "../../../../constants";
import { deployERC20 } from "../../../../ERC20/shared/fixtures";

export function shouldBalanceOfERC20(factory: () => Promise<Contract>) {
  describe("balanceOfERC20", function () {
    it("should get balance of erc20 tokens", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc20Instance = await deployERC20("ERC20Simple");

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(erc721Instance.address, amount);
      await erc721Instance.mintCommon(owner.address, templateId); // this is edge case
      await erc721Instance.mintCommon(owner.address, templateId);

      await erc721Instance.getERC20(owner.address, 1, erc20Instance.address, amount);

      const balance = await erc721Instance.balanceOfERC20(1, erc20Instance.address);
      expect(balance).to.equal(amount);
    });
  });
}
