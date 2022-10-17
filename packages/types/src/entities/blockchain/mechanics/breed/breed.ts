import type { IIdDateBase } from "@gemunion/types-collection";
import { IToken } from "../../hierarchy/token";
import { IBreedHistory } from "./history";

export interface IBreed extends IIdDateBase {
  genes: string;
  count: number;
  tokenId: number;
  token: IToken;
  childs?: Array<IBreedHistory>;
  matrons?: Array<IBreedHistory>;
  sires?: Array<IBreedHistory>;
}
