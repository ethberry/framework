import { shouldUnpackBox } from "./unpack";
import { shouldMintBox } from "./mint";
import { shouldNotMintCommon } from "../../../../../ERC721/shared/shouldNotMintCommon";

export function shouldBehaveLikeERC721MysteryBox(factory: () => Promise<any>) {
  shouldMintBox(factory);
  shouldUnpackBox(factory);
  shouldNotMintCommon(factory);
}
