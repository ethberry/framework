import { IAssetDto, ShapeType } from "@framework/types";

export interface IVestingBoxCreateDto {
  title: string;
  description: string;
  content: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  contractId: number;
  shape: ShapeType;
  startTimestamp: string; // in seconds
  duration: number; // in seconds
  period: number; // in seconds
  cliff: number; // in seconds
  afterCliffBasisPoints: number;
  growthRate: number; // percent point (100% === 10 000)
}
