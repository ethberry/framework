import { IsEthereumAddress, IsString } from "class-validator";

import type { IRaffleScheduleUpdateRmq } from "@framework/types";

import { ScheduleDto } from "../../../../../common/dto/schedule";

export class RaffleScheduleUpdateRmqDto extends ScheduleDto implements IRaffleScheduleUpdateRmq {
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public address: string;
}
