import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { amount, tokenId, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

import { shouldReceive } from "./receive";

export function shouldBehaveLikeTopUp(factory: () => Promise<Contract>) {
  describe("topUp", function () {
    it("should top-up with NATIVE token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = await contractInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        { value: amount },
      );

      await expect(tx).to.emit(contractInstance, "PaymentEthReceived").withArgs(contractInstance.address, amount);

      await expect(tx).to.changeEtherBalances([owner, contractInstance], [-amount, amount]);
    });

    it("should top-up with ERC20 token", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const erc20Factory = await ethers.getContractFactory("ERC20Simple");
      const erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);
      await erc20Instance.mint(owner.address, amount);

      await erc20Instance.approve(contractInstance.address, amount);

      const tx = await contractInstance.topUp([
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId,
          amount,
        },
      ]);

      await expect(tx)
        .to.emit(contractInstance, "TransferReceived")
        .withArgs(contractInstance.address, owner.address, amount, "0x");

      await expect(tx).changeTokenBalances(erc20Instance, [owner, contractInstance], [-amount, amount]);
    });
  });

  shouldReceive(factory);
}
