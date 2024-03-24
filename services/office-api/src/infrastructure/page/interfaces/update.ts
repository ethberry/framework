import { PageStatus } from "@framework/types";

import type { IPageCreateDto } from "./create";

export interface IPageUpdateDto extends IPageCreateDto {
  pageStatus: PageStatus;
}
