import { Mixin } from "ts-mixer";

import { ScheduleDto, AddressDto } from "@gemunion/nest-js-validators";
import type { IRaffleScheduleUpdateRmq } from "@framework/types";

export class RaffleScheduleUpdateRmqDto extends Mixin(AddressDto, ScheduleDto) implements IRaffleScheduleUpdateRmq {}
