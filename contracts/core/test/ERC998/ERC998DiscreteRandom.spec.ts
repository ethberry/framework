import { shouldSupportsInterface } from "@gemunion/contracts-utils";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-access";
import {
  DEFAULT_ADMIN_ROLE,
  InterfaceId,
  METADATA_ROLE,
  MINTER_ROLE,
  RARITY,
  TEMPLATE_ID,
} from "@gemunion/contracts-constants";

import { FrameworkInterfaceId, templateId } from "../constants";
import { shouldMintCommon } from "../ERC721/shared/simple/base/mintCommon";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeDiscrete } from "../Mechanics/Grade/upgrade";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";

describe("ERC998DiscreteRandom", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);

  shouldBehaveLikeERC998Simple(factory, {}, [
    { key: TEMPLATE_ID, value: templateId },
    { key: RARITY, value: 0n },
  ]);
  shouldBehaveLikeDiscrete(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
    FrameworkInterfaceId.ERC721Random,
    FrameworkInterfaceId.ERC721Upgradable,
  ]);
});
