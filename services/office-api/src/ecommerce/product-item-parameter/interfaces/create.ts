export interface IProductItemParameterCreateDto {
  productItemId: number;
  parameterId?: number | null;
  customParameterId?: number | null;
  userCustomValue: string;
}
