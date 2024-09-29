import { Mixin } from "ts-mixer";

import { AddressDto, ChainIdDto, ScheduleDto } from "@ethberry/nest-js-validators";
import type { IRaffleScheduleUpdateRmq } from "@framework/types";

export class RaffleScheduleUpdateRmqDto
  extends Mixin(AddressDto, ScheduleDto, ChainIdDto)
  implements IRaffleScheduleUpdateRmq {}
