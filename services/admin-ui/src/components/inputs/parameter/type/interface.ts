export enum PARAMETER_TYPE {
  string = "string",
  number = "number",
  date = "date",
}

export interface IParameterTypeInput {
  prefix: string;
  name?: string;
  options?: any;
}
