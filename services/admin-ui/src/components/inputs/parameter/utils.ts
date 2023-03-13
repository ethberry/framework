import { ProductParameters } from "@framework/types";

import { IGetEmptyParameter } from "./empty";

export const getLeftParameterNames: (props: IGetEmptyParameter) => ProductParameters[] | null = props => {
  const { parameters = [] } = props;

  const leftParameterNames = Object.values(ProductParameters).filter(a =>
    parameters.length ? parameters.every(p => p.parameterName !== a) : true,
  );

  return leftParameterNames.length > 0 ? leftParameterNames : null;
};
