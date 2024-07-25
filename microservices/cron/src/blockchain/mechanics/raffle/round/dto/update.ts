import { Mixin } from "ts-mixer";

import { AddressDto, ChainIdDto, ScheduleDto } from "@gemunion/nest-js-validators";
import type { IRaffleScheduleUpdateRmq } from "@framework/types";

export class RaffleScheduleUpdateRmqDto
  extends Mixin(AddressDto, ScheduleDto, ChainIdDto)
  implements IRaffleScheduleUpdateRmq {}
