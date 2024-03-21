import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { SemiCoinDto } from "@gemunion/nest-js-validators";
import type { IWaitListListCreateDto } from "@framework/types";

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
