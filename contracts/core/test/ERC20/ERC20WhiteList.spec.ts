import { expect } from "chai";

import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeWhiteList } from "@gemunion/contracts-access-list";

import { deployERC20 } from "./shared/fixtures";
import { shouldBehaveLikeERC20WithoutTransfer } from "./shared/simple";
import { shouldBehaveLikeERC20WhiteList } from "./shared/whitelist";

describe("ERC20Whitelist", function () {
  const factory = async () => {
    const [owner, receiver] = await ethers.getSigners();
    const contractInstance = await deployERC20(this.title);
    const tx1 = contractInstance.whitelist(owner.address);
    await expect(tx1).to.emit(contractInstance, "Whitelisted").withArgs(owner.address);
    const tx2 = contractInstance.whitelist(receiver.address);
    await expect(tx2).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);
    return contractInstance;
  };

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldBehaveLikeWhiteList(factory);
  shouldBehaveLikeERC20WhiteList(factory);

  shouldBehaveLikeERC20WithoutTransfer(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC1363,
  );
});
