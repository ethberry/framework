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

export interface IParameter {
  parameterName: string;
  parameterType: string;
  parameterValue: string;
  parameterExtra: string;
}

// export interface IParameter {
//   parameterName: string;
//   parameterType: "string" | "number" | "date";
//   parameterValue: string | number;
//   parameterMaxValue?: number;
// }
