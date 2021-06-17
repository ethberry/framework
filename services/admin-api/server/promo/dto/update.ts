import {IPromoUpdateDto} from "../interfaces";
import {PromoCreateDto} from "./create";

export class PromoUpdateDto extends PromoCreateDto implements IPromoUpdateDto {}
