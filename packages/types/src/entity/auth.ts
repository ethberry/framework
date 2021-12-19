import { IJwt } from "@gemunion/types-jwt";
import { IBase } from "@gemunion/types-collection";

export interface IAuth extends IJwt, IBase {
  ip: string;
}
