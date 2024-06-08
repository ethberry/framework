import { ScheduleOptionalDto } from "@gemunion/nest-js-validators";
import type { IRaffleScheduleUpdateDto } from "@framework/types";

export class RaffleScheduleUpdateDto extends ScheduleOptionalDto implements IRaffleScheduleUpdateDto {}
