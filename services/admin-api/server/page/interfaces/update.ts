import {PageStatus} from "@trejgun/solo-types";

import {IPageCreateDto} from "./create";

export interface IPageUpdateDto extends IPageCreateDto {
  pageStatus: PageStatus;
}
