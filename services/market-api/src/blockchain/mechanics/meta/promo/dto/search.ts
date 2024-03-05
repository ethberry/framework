import { Mixin } from "ts-mixer";

import { ChainIdDto, PaginationDto } from "@gemunion/collection";

import { IPromoSearchDto } from "../interfaces";

export class PromoSearchDto extends Mixin(PaginationDto, ChainIdDto) implements IPromoSearchDto {}
