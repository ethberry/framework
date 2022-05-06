import { Erc721DropboxStatus } from "@framework/types";

import { IErc721DropboxCreateDto } from "./create";

export interface IErc721DropboxUpdateDto extends IErc721DropboxCreateDto {
  dropboxStatus: Erc721DropboxStatus;
}
