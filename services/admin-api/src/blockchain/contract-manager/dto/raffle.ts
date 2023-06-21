import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IRaffleConfigDto, IRaffleContractDeployDto } from "@framework/types";

export class RaffleConfigDto implements IRaffleConfigDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public timeLagBeforeRelease: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public commission: number;
}

export class RaffleContractDeployDto implements IRaffleContractDeployDto {
  @ApiProperty({
    type: RaffleConfigDto,
  })
  @ValidateNested()
  @Type(() => RaffleConfigDto)
  public config: RaffleConfigDto;
}
