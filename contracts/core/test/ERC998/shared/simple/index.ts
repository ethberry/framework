import { Contract } from "ethers";

import { shouldBehaveLikeERC721Simple } from "../../../ERC721/shared/simple";
import { IERC721EnumOptions } from "@gemunion/contracts-erc721-enumerable";

export function shouldBehaveLikeERC998Simple(factory: () => Promise<Contract>, options?: IERC721EnumOptions) {
  shouldBehaveLikeERC721Simple(factory, options);
}
