import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC1155 } from "./shared/fixtures";
import { shouldBehaveLikeERC1155Simple } from "./shared/simple";

describe("ERC1155Simple", function () {
  const factory = () => deployERC1155(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC1155Simple(factory);
});
