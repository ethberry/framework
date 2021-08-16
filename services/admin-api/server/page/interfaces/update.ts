import { PageStatus } from "@gemunion/framework-types";

import { IPageCreateDto } from "./create";

export interface IPageUpdateDto extends IPageCreateDto {
  pageStatus: PageStatus;
}
