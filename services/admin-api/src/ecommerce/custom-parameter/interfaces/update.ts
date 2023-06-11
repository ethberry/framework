import { ParameterType } from "@framework/types";

export interface ICustomParameterUpdateDto {
  parameterName: string;
  parameterType: ParameterType;
  parameterValue?: string | null;
}
