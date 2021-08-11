import {PageStatus} from "@gemunionstudio/solo-types";

import {IPageCreateDto} from "./create";

export interface IPageUpdateDto extends IPageCreateDto {
  pageStatus: PageStatus;
}
