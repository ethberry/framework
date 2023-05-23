import { Contract } from "ethers";
import { shouldUnpackBox } from "./unpack";
import { shouldMintBox } from "./mint";
import { shouldNotMintCommon } from "../../../../../ERC721/shared/traits/shouldNotMintCommon";

export function shouldBehaveLikeERC721MysteryBox(factory: () => Promise<Contract>) {
  shouldMintBox(factory);
  shouldUnpackBox(factory);
  shouldNotMintCommon(factory);
}
