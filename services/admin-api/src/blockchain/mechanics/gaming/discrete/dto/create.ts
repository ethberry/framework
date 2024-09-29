import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsString,
  Matches,
  MaxLength,
  Min,
  Validate,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { ForbidEnumValues, SemiCoinDto } from "@ethberry/nest-js-validators";
import { DiscreteStrategy, ProtectedAttribute } from "@framework/types";
import type { IDiscreteCreateDto } from "@framework/types";

export class DiscreteCreateDto implements IDiscreteCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty({
    maxLength: 32,
  })
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  @Validate(ForbidEnumValues, Object.values(ProtectedAttribute))
  @Matches(/^[A-Z][A-Z0-9]*$/, { message: "patternMismatch" })
  public attribute: string;

  @ApiProperty()
  @IsEnum(DiscreteStrategy, { message: "badInput" })
  public discreteStrategy: DiscreteStrategy;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => o.discreteStrategy === DiscreteStrategy.EXPONENTIAL)
  public growthRate: number;

  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;
}
