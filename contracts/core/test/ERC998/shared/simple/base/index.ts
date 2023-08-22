import {
  shouldChildContractsFor,
  shouldChildExists,
  shouldGetRootOwnerOfChild,
  shouldNotTransferChildToParent,
  shouldOwnerOfChild,
  shouldSafeTransferChild,
  shouldSafeTransferFrom,
  shouldTransferChild,
} from "@gemunion/contracts-erc998td";
import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

export function shouldBehaveLikeERC998(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  shouldChildContractsFor(factory, options);
  shouldChildExists(factory, options);
  shouldNotTransferChildToParent(factory, options);
  shouldOwnerOfChild(factory, options);
  shouldGetRootOwnerOfChild(factory);
  shouldSafeTransferChild(factory, options);
  shouldSafeTransferFrom(factory, options);
  shouldTransferChild(factory, options);
}
