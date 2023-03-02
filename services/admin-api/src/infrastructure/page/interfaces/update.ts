import { PageStatus } from "@framework/types";

import { IPageCreateDto } from "./create";

export interface IPageUpdateDto extends IPageCreateDto {
  pageStatus: PageStatus;
}
