import { ISearchDto } from "@gemunion/types-collection";

export interface IProductItemSearchDto extends ISearchDto {
  parameterIds: Array<number>;
}
