import { IGetEmptyParameter } from "./empty";

export const getAvailableNames: (props: IGetEmptyParameter) => string[] | null = props => {
  const { allNames = [], parameters = [] } = props;

  const availableNames = allNames.filter(name =>
    parameters.length ? parameters.every(p => p.parameterName !== name) : true,
  );

  return availableNames.length > 0 ? availableNames : null;
};

export const uniqueBy = (array: any[], by: string) => {
  const uniqueArray: any[] = [];

  array.forEach(item => {
    const found = uniqueArray.find(it => it[by] === item[by]);
    if (!found) {
      uniqueArray.push(item);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return uniqueArray;
};
