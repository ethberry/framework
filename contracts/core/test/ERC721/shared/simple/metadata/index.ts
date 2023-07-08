import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { shouldIsRecordFieldKey } from "./isRecordFieldKey";
import { shouldIsRecord } from "./isRecord";
import { shouldGetRecordFieldValue } from "./getRecordFieldValue";
import { shouldGetTokenMetadata } from "./getTokenMetadata";
import { shouldGetRecordFieldKeyCount } from "./getRecordFieldKeyCount";
import { shouldGetRecordCount } from "./getRecordCount";

export function shouldBehaveLikeERC721Metadata(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  shouldGetTokenMetadata(factory, options);
  shouldGetRecordCount(factory, options);
  shouldGetRecordFieldKeyCount(factory, options);
  shouldIsRecord(factory, options);
  shouldIsRecordFieldKey(factory, options);
  shouldGetRecordFieldValue(factory, options);
}
