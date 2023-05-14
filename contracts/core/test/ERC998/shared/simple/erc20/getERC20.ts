import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

import { templateId } from "../../../../constants";
import { deployERC20 } from "../../../../ERC20/shared/fixtures";

export function shouldGetERC20(factory: () => Promise<Contract>) {
  describe("getERC20", function () {
    it("should get ERC20 tokens", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc20Instance = await deployERC20("ERC20Mock");

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(contractInstance.address, amount);

      await contractInstance.mintCommon(owner.address, templateId); // this is edge case
      await contractInstance.mintCommon(owner.address, templateId);

      const tx1 = contractInstance.getERC20(owner.address, 1, erc20Instance.address, amount);
      await expect(tx1)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, contractInstance.address, amount)
        .to.emit(contractInstance, "ReceivedChild")
        .withArgs(owner.address, 1, erc20Instance.address, 0, amount)
        .to.not.emit(contractInstance, "TransferReceived");
    });

    it("should get ERC1363 tokens", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc20Factory = await ethers.getContractFactory("ERC1363Mock");
      const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol);

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(contractInstance.address, amount);
      await contractInstance.mintCommon(owner.address, templateId); // this is edge case
      await contractInstance.mintCommon(owner.address, templateId);

      const tx1 = contractInstance.getERC20(owner.address, 1, erc20Instance.address, amount);
      await expect(tx1)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, contractInstance.address, amount)
        .to.emit(contractInstance, "ReceivedChild")
        .withArgs(owner.address, 1, erc20Instance.address, 0, amount)
        .to.emit(contractInstance, "TransferReceived");
    });
  });
}
