import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeERC998 } from "./shared/simple/base";

describe.skip("ERC998StateHash", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998Simple(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721);
});
