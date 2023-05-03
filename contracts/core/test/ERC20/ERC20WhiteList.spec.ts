import { expect } from "chai";
import { BigNumberish, Contract, Signer } from "ethers";

import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { amount, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeWhiteList } from "@gemunion/contracts-access-list";

import { deployERC20 } from "./shared/fixtures";
import { shouldBehaveLikeERC20WhiteList } from "./shared/whitelist/whitelist";
import { shouldBehaveLikeERC20Custom } from "./shared/whitelist";

describe("ERC20Whitelist", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldBehaveLikeWhiteList(factory);
  shouldBehaveLikeERC20WhiteList(factory);

  shouldBehaveLikeERC20Custom(factory, {
    mint: async (
      contractInstance: Contract,
      signer: Signer,
      receiver: string,
      value: BigNumberish = amount,
    ): Promise<any> => {
      const tx = contractInstance.whitelist(receiver);
      await expect(tx).to.emit(contractInstance, "Whitelisted").withArgs(receiver);
      return contractInstance.connect(signer).mint(receiver, value) as Promise<any>;
    },
  });

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC1363,
  );
});
