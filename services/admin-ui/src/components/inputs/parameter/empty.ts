import { IParameter } from "@framework/types";

import { PARAMETER_TYPE } from "./type/interface";
import { getLeftParameterNames } from "./utils";

export interface IGetEmptyParameter {
  parameters?: IParameter[];
}

export const getEmptyParameter: (props: IGetEmptyParameter) => IParameter | null = props => {
  const leftParameterNames = getLeftParameterNames(props);

  const parameterName = leftParameterNames ? leftParameterNames[0] : null;

  if (!parameterName) {
    return null;
  }

  return {
    parameterName,
    parameterType: PARAMETER_TYPE.number,
    parameterValue: 0,
    parameterMaxValue: 3,
  };
};
