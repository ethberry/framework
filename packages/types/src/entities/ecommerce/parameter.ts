import { IIdDateBase } from "@gemunion/types-collection";

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

export interface IParameter extends IIdDateBase {
  parameterName: string;
  parameterType: ParameterType;
  parameterValue: string;
  parameterMinValue: string;
  parameterMaxValue: string;
}
