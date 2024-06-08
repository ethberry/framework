import { IsEthereumAddress, IsString } from "class-validator";

import { ScheduleDto } from "../../../../../common/dto/schedule";

export class LotteryScheduleUpdateDto extends ScheduleDto {
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public address: string;
}
