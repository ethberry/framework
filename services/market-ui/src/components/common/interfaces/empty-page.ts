import { emptyStateString } from "@gemunion/draft-js-utils";
import type { IPage } from "@framework/types";

export const emptyPage = {
  title: "",
  description: emptyStateString,
} as unknown as IPage;
