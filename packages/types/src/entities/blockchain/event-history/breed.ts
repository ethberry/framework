import type { IIdDateBase } from "@gemunion/types-collection";

import type { IBreed } from "../mechanics/breed/breed";

export interface IBreedHistory extends IIdDateBase {
  account: string;
  childId: number | null;
  child?: IBreed;
  matronId: number;
  matron?: IBreed;
  sireId: number;
  sire?: IBreed;
}
