import { IParameter } from "@framework/types";

export interface IParameterCreateDto extends Omit<IParameter, "id" | "products" | "createdAt" | "updatedAt"> {}
