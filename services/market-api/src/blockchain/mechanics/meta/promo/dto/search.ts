import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";

import type { IPromoSearchDto } from "../interfaces";

export class PromoSearchDto extends Mixin(PaginationDto) implements IPromoSearchDto {}
