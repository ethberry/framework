import { ParameterType } from "@framework/types";

export interface ICustomParameterCreateDto {
  productItemId: number;
  parameterName: string;
  parameterType: ParameterType;
  parameterValue?: string | null;
  userId: number;
}
