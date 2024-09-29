import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@ethberry/collection";
import type { IWaitListListCreateDto } from "@framework/types";

import { SemiCoinDto } from "@ethberry/nest-js-validators";

export class WaitListListCreateDto extends SearchableDto implements IWaitListListCreateDto {
  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public item: InstanceType<typeof SemiCoinDto>;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty()
  @IsBoolean({ message: "typeMismatch" })
  public isPrivate: boolean;
}
