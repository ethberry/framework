import { IJwt } from "../jwt";
import { IBase } from "./base";

export interface IAuth extends IJwt, IBase {
  ip: string;
}
