import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { NftDto, NotNativeDto } from "@ethberry/nest-js-validators";
import { DismantleStrategy } from "@framework/types";

import type { IDismantleCreateDto } from "../interfaces";

export class DismantleCreateDto implements IDismantleCreateDto {
  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public price: InstanceType<typeof NftDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => o.discreteStrategy === DismantleStrategy.EXPONENTIAL)
  public growthRate: number;

  @ApiProperty()
  @IsEnum(DismantleStrategy, { message: "badInput" })
  public dismantleStrategy: DismantleStrategy;
}
