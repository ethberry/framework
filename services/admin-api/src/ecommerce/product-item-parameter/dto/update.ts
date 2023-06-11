import { IProductItemParameterUpdateDto } from "../interfaces";
import { ProductItemParameterCreateDto } from "./create";

export class ProductItemParameterUpdateDto
  extends ProductItemParameterCreateDto
  implements IProductItemParameterUpdateDto {}
