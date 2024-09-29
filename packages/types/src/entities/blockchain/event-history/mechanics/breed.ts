import type { IIdDateBase } from "@ethberry/types-collection";

import type { IBreed } from "../../mechanics/gaming/breed/breed";

export interface IBreedHistory extends IIdDateBase {
  account: string;
  childId: number | null;
  child?: IBreed;
  matronId: number;
  matron?: IBreed;
  sireId: number;
  sire?: IBreed;
}
