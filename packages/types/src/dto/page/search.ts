import { ISearchDto } from "@gemunion/types-collection";

import { PageStatus } from "../../entity";

export interface IPageSearchDto extends ISearchDto {
  pageStatus: Array<PageStatus>;
}
