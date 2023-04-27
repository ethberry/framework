import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC721 } from "../ERC721/shared/fixtures";
import { FrameworkInterfaceId } from "../constants";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { shouldBehaveLikeERC721Rentable } from "../ERC721/shared/user";
import { shouldBehaveLikeERC998 } from "./shared/simple/base";

describe("ERC998Rentable", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998Simple(factory);
  shouldBehaveLikeERC721Rentable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4907,
    FrameworkInterfaceId.ERC998ERC721TopDown,
  );
});
