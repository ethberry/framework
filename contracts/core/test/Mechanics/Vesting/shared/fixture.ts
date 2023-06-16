import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { amount, span, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployVesting(name: string): Promise<any> {
  const [owner] = await ethers.getSigners();
  const current = await time.latest();
  const vestingFactory = await ethers.getContractFactory(name);
  const vestingInstance: any = await vestingFactory.deploy(owner.address, current.toNumber(), span * 4);

  await vestingInstance.topUp(
    [
      {
        tokenType: 0,
        token: ZeroAddress,
        tokenId: 0,
        amount: amount * 100n,
      },
    ],
    { value: amount * 100n },
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return vestingInstance;
}

export async function deployERC20(contractInstance: any): Promise<any> {
  const factory = await ethers.getContractFactory("ERC20Simple");
  const instance: any = await factory.deploy(tokenName, tokenSymbol, amount * 100n);
  await instance.mint(await contractInstance.getAddress(), amount * 100n);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return instance;
}
