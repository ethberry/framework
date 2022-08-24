import type { ISearchDto } from "@gemunion/types-collection";

import { PageStatus } from "../../entities";

export interface IPageSearchDto extends ISearchDto {
  pageStatus: Array<PageStatus>;
}
