import { expect } from "chai";
import { ethers } from "hardhat";

import { ERC20Simple, ERC721TokenWrapper } from "../../../typechain-types";
import { amountWeiEth, baseTokenURI, cap, royalty } from "../../constants";

describe("Wrapper", function () {
  let wrapperInstance: ERC721TokenWrapper;
  let erc20Instance: ERC20Simple;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const wrapperFactory = await ethers.getContractFactory("ERC721TokenWrapper");
    wrapperInstance = await wrapperFactory.deploy("WRAPPER", "WRAP", royalty, baseTokenURI);

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy("Space Credits", "GEM20", cap);

    await erc20Instance.approve(wrapperInstance.address, amountWeiEth);
  });

  it("should wrap ERC20 and unwrap ERC20", async function () {
    await erc20Instance.mint(this.owner.address, amountWeiEth);
    const items = [
      {
        tokenType: 1,
        token: erc20Instance.address,
        tokenId: 0,
        amount: amountWeiEth,
      },
    ];

    const tx = wrapperInstance.mintBox(this.owner.address, 1, items);
    await expect(tx).to.emit(erc20Instance, "Transfer");
    await expect(tx).to.changeTokenBalance(erc20Instance, this.owner, "-10000000000000000");

    const tx1 = wrapperInstance.unpack(1);
    await expect(tx1).to.emit(erc20Instance, "Transfer");
    await expect(tx1).to.changeTokenBalance(erc20Instance, this.owner, "10000000000000000");
  });
});
