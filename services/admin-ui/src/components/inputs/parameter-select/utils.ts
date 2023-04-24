import { IGetEmptyParameter } from "./empty";

export const getAvailableNames: (props: IGetEmptyParameter) => string[] | null = props => {
  const { allNames = [], parameters = [] } = props;

  const availableNames = allNames.filter(name =>
    parameters.length ? parameters.every(p => p.parameterName !== name) : true,
  );

  return availableNames.length > 0 ? availableNames : null;
};

export const capitalize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
