import { DropboxStatus } from "@framework/types";

import { IErc998DropboxCreateDto } from "./create";

export interface IErc998DropboxUpdateDto extends IErc998DropboxCreateDto {
  dropboxStatus: DropboxStatus;
}
