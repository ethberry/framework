import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountDto } from "@gemunion/collection";
import type { IRaffleConfigDto, IRaffleContractDeployDto } from "@framework/types";

export class RaffleConfigDto extends AccountDto implements IRaffleConfigDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public timeLagBeforeRelease: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public commission: number;
}

export class RaffleContractDeployDto extends AccountDto implements IRaffleContractDeployDto {
  @ApiProperty({
    type: RaffleConfigDto,
  })
  @ValidateNested()
  @Type(() => RaffleConfigDto)
  public config: RaffleConfigDto;
}
