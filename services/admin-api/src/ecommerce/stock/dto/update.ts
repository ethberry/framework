import type { IStockUpdateDto } from "../interfaces";
import { StockCreateDto } from "./create";

export class StockUpdateDto extends StockCreateDto implements IStockUpdateDto {}
