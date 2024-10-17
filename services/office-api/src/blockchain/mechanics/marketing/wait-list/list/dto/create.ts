import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@ethberry/collection";
import type { IWaitListListCreateDto } from "@framework/types";

import { NotNativeDto } from "@ethberry/nest-js-validators";

export class WaitListListCreateDto extends SearchableDto implements IWaitListListCreateDto {
  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty()
  @IsBoolean({ message: "typeMismatch" })
  public isPrivate: boolean;
}
