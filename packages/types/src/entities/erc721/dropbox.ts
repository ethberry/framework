import { IIdDateBase } from "@gemunion/types-collection";

import { IErc721Collection } from "./collection";
import { IErc721Template } from "./template";

export enum Erc721DropboxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc721Dropbox extends IIdDateBase {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  dropboxStatus: Erc721DropboxStatus;
  erc721TemplateId: number;
  erc721Template?: IErc721Template;
  erc721CollectionId: number;
  erc721Collection?: IErc721Collection;
}
