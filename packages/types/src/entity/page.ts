import { IBase } from "@gemunion/types-collection";

export enum PageStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IPage extends IBase {
  slug: string;
  title: string;
  description: string;
  pageStatus: PageStatus;
}
