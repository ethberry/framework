import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto, ChainIdDto, NotNativeDto } from "@ethberry/nest-js-validators";
import { IClaimCreateDto } from "@framework/types";

export class ClaimTemplateCreateDto extends Mixin(AccountDto, ChainIdDto) implements IClaimCreateDto {
  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}
