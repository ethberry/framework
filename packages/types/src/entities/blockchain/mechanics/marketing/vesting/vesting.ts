import type { ISearchable } from "@ethberry/types-collection";

import { ITemplate } from "../../../hierarchy/template";
import { IAsset } from "../../../exchange/asset";
import { IToken } from "../../../hierarchy/token";

export enum VestingType {
  LINEAR = "LINEAR",
  HYPERBOLIC = "HYPERBOLIC",
  EXPONENTIAL = "EXPONENTIAL",
}

export enum VestingBoxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/** keys and values of ShapeType must be named with a prefix equals VestingType **/
export enum ShapeType {
  LINEAR = "LINEAR",
  LINEAR_CLIFF = "LINEAR_CLIFF",
  LINEAR_IMMEDIATE = "LINEAR_IMMEDIATE",
  LINEAR_CLIFF_IMMEDIATE = "LINEAR_CLIFF_IMMEDIATE",
  LINEAR_STEPS = "LINEAR_STEPS",
  EXPONENTIAL = "EXPONENTIAL",
  EXPONENTIAL_CLIFF = "EXPONENTIAL_CLIFF",
  EXPONENTIAL_IMMEDIATE = "EXPONENTIAL_IMMEDIATE",
  EXPONENTIAL_CLIFF_IMMEDIATE = "EXPONENTIAL_CLIFF_IMMEDIATE",
  HYPERBOLIC = "HYPERBOLIC",
  HYPERBOLIC_CLIFF = "HYPERBOLIC_CLIFF",
  HYPERBOLIC_IMMEDIATE = "HYPERBOLIC_IMMEDIATE",
  HYPERBOLIC_CLIFF_IMMEDIATE = "HYPERBOLIC_CLIFF_IMMEDIATE",
}

export interface IVestingBox extends ISearchable {
  imageUrl: string;
  contentId: number;
  content?: IAsset;
  templateId: number;
  template?: ITemplate;
  tokens?: Array<IToken>;
  vestingBoxStatus: VestingBoxStatus;
  functionType: VestingType;
  shape: ShapeType;
  cliff: number;
  startTimestamp: string;
  duration: number;
  period: number;
  afterCliffBasisPoints: number;
  growthRate: number;
}
