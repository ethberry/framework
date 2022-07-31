import { IIdDateBase } from "@gemunion/types-collection";

import { ITemplate } from "../blockchain/hierarchy/template";

export interface IDrop extends IIdDateBase {
  templateId: number;
  template: ITemplate;
  startTimestamp: string;
  endTimestamp: string;
}
