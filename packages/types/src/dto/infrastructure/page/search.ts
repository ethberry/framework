import type { ISearchDto } from "@ethberry/types-collection";

import { PageStatus } from "../../../entities";

export interface IPageSearchDto extends ISearchDto {
  pageStatus: Array<PageStatus>;
}
