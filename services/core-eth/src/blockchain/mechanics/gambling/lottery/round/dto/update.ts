import { Mixin } from "ts-mixer";

import { AddressDto, ChainIdDto, ScheduleDto } from "@gemunion/nest-js-validators";
import type { ILotteryScheduleUpdateRmq } from "@framework/types";

export class LotteryScheduleUpdateDto
  extends Mixin(AddressDto, ScheduleDto, ChainIdDto)
  implements ILotteryScheduleUpdateRmq {}
