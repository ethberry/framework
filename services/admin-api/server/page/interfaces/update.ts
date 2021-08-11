import { PageStatus } from "@gemunionstudio/framework-types";

import { IPageCreateDto } from "./create";

export interface IPageUpdateDto extends IPageCreateDto {
  pageStatus: PageStatus;
}
