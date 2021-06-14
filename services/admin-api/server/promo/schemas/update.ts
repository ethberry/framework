import {IPromoUpdateDto} from "../interfaces";
import {PromoCreateSchema} from "./create";

export class PromoUpdateSchema extends PromoCreateSchema implements IPromoUpdateDto {}
