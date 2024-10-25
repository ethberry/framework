import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { ILotteryConfigDto, ILotteryContractDeployDto } from "@framework/types";

export class LotteryConfigDto implements ILotteryConfigDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public timeLagBeforeRelease: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public commission: number;
}

export class LotteryContractDeployDto implements ILotteryContractDeployDto {
  @ApiProperty({
    type: LotteryConfigDto,
  })
  @ValidateNested()
  @Type(() => LotteryConfigDto)
  public config: LotteryConfigDto;
}
