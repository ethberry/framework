import { IJwt } from "@gemunion/types-jwt";
import { IIdBase } from "@gemunion/types-collection";

export interface IAuth extends IJwt, IIdBase {
  ip: string;
}
