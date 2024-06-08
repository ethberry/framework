import { Mixin } from "ts-mixer";

import { ScheduleDto, AddressDto } from "@gemunion/nest-js-validators";
import type { ILotteryScheduleUpdateRmq } from "@framework/types";

export class LotteryScheduleUpdateDto extends Mixin(AddressDto, ScheduleDto) implements ILotteryScheduleUpdateRmq {}
