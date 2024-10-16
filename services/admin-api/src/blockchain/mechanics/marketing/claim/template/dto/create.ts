import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AccountDto, SemiNftDto } from "@ethberry/nest-js-validators";
import type { IClaimCreateDto } from "@framework/types";

export class ClaimTemplateCreateDto extends AccountDto implements IClaimCreateDto {
  @ApiProperty({
    type: SemiNftDto,
  })
  @ValidateNested()
  @Type(() => SemiNftDto)
  public item: InstanceType<typeof SemiNftDto>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;

  public chainId: number;
}
