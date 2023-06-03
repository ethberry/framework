import { Contract } from "ethers";

import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { shouldBehaveLikeERC721Simple } from "../../../ERC721/shared/simple";

export function shouldBehaveLikeERC998Simple(factory: () => Promise<Contract>, options?: IERC721EnumOptions) {
  shouldBehaveLikeERC721Simple(factory, options);
}
