import { IParameter } from "@framework/types";

export interface IParameterUpdateDto extends Omit<IParameter, "id" | "products" | "createdAt" | "updatedAt"> {}
