import { IIdBase } from "@gemunion/types-collection";
import { IProduct } from "./product";

export enum ProductColor {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
}

export enum ProductSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL",
}

export enum ProductParameters {
  COLOR = "COLOR",
  SIZE = "SIZE",
  VOLUME = "VOLUME",
  FLAVOUR = "FLAVOUR",
}

export enum ParameterType {
  DATE = "DATE",
  ENUM = "ENUM",
  STRING = "STRING",
  NUMBER = "NUMBER",
}

export interface IParameter extends IIdBase {
  parameterName: string;
  parameterType: ParameterType;
  parameterValue: string | null;
  parameterMinValue: string | null;
  parameterMaxValue: string | null;
  products: Array<IProduct>;
}
