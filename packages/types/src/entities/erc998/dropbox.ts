import { IIdDateBase } from "@gemunion/types-collection";

import { IErc998Collection } from "./collection";
import { IErc998Template } from "./template";

export enum Erc998DropboxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc998Dropbox extends IIdDateBase {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  dropboxStatus: Erc998DropboxStatus;
  erc998TemplateId: number;
  erc998Template?: IErc998Template;
  erc998CollectionId: number;
  erc998Collection?: IErc998Collection;
}
