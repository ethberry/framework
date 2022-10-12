import type { IIdDateBase } from "@gemunion/types-collection";

export interface IBreedHistory extends IIdDateBase {
  account: string;
  childId?: number | null;
  matronId: number;
  sireId: number;
}
