import { IIdDateBase } from "@gemunion/types-collection";

export enum PageStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IPage extends IIdDateBase {
  slug: string;
  title: string;
  description: string;
  pageStatus: PageStatus;
}
