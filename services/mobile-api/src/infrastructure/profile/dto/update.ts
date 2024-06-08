import { Mixin } from "ts-mixer";

import { ChainIdOptionalDto } from "@gemunion/nest-js-validators";

import type { IProfileUpdateDto } from "../interfaces";
import { UserCommonDto } from "../../../common/dto";

export class ProfileUpdateDto extends Mixin(UserCommonDto, ChainIdOptionalDto) implements IProfileUpdateDto {}
