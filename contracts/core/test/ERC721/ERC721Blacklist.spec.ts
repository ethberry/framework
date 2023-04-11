import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";

import { shouldMintCommon } from "./shared/mintCommon";

import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { deployERC721 } from "./shared/fixtures";

describe("ERC721Blacklist", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeBlackList(factory);

  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721);

  describe("Blacklisted", function () {
    it("shoud fail: sender is blacklisted", async function () {
      const [_owner, recever] = await ethers.getSigners();

      const erc721Instance = await factory();
      await erc721Instance.mintCommon(recever.address, 1);

      await erc721Instance.blacklist(recever.address);

      const tx = erc721Instance
        .connect(recever)
        ["safeTransferFrom(address,address,uint256)"](recever.address, _owner.address, 1);

      await expect(tx).to.be.rejectedWith("Blacklist: sender is blacklisted");
    });

    it("shoud fail: receiver is blacklisted", async function () {
      const [owner, recever] = await ethers.getSigners();

      const erc721Instance = await factory();
      await erc721Instance.mintCommon(owner.address, 1);

      await erc721Instance.blacklist(recever.address);

      const tx = erc721Instance["safeTransferFrom(address,address,uint256)"](owner.address, recever.address, 1);

      await expect(tx).to.be.rejectedWith("Blacklist: receiver is blacklisted");
    });
  });
});
