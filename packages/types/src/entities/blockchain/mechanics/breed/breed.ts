import type { IIdDateBase } from "@gemunion/types-collection";
import { IToken } from "../../hierarchy/token";

export interface IBreed extends IIdDateBase {
  genes: string;
  count: number;
  tokenId: number | null;
  token?: IToken;
}
