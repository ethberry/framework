import {
  IERC721EnumOptions,
  shouldChildContractsFor,
  shouldChildExists,
  shouldNotTransferChildToParent,
  shouldOwnerOfChild,
  shouldGetRootOwnerOfChild,
  shouldSafeTransferChild,
  shouldSafeTransferFrom,
  shouldTransferChild,
} from "@gemunion/contracts-erc998td";

export function shouldBehaveLikeERC998(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  shouldChildContractsFor(factory, options);
  shouldChildExists(factory, options);
  shouldNotTransferChildToParent(factory);
  shouldOwnerOfChild(factory, options);
  shouldGetRootOwnerOfChild(factory);
  shouldSafeTransferChild(factory, options);
  shouldSafeTransferFrom(factory, options);
  shouldTransferChild(factory, options);
}
