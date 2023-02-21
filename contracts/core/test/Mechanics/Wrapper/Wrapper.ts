import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";

import { deployERC20 } from "../../ERC20/shared/fixtures";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "../../ERC721/shared/simple";

describe("Wrapper", function () {
  const factory = () => deployERC721("ERC721WrapperTest");
  const erc20Factory = () => deployERC20();

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeERC721Simple(factory);

  it("should wrap ERC20 and unwrap ERC20", async function () {
    const [owner] = await ethers.getSigners();

    const erc20Instance = await erc20Factory();
    const erc721Instance = await factory();

    await erc20Instance.mint(owner.address, amount);
    await erc20Instance.approve(erc721Instance.address, amount);

    const items = [
      {
        tokenType: 1,
        token: erc20Instance.address,
        tokenId: 0,
        amount,
      },
    ];

    const tx = erc721Instance.mintBox(owner.address, 1, items);
    await expect(tx).to.emit(erc20Instance, "Transfer");
    await expect(tx).to.changeTokenBalance(erc20Instance, owner, -amount);

    const tx1 = erc721Instance.unpack(1);
    await expect(tx1).to.emit(erc20Instance, "Transfer");
    await expect(tx1).to.changeTokenBalance(erc20Instance, owner, amount);
  });
});
