import { DropboxStatus } from "@framework/types";

import { IDropboxCreateDto } from "./create";

export interface IDropboxUpdateDto extends IDropboxCreateDto {
  dropboxStatus: DropboxStatus;
}
