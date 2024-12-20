import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SemiNftDto, NotNativeDto } from "@gemunion/nest-js-validators";

import type { ICraftCreateDto } from "../interfaces";

export class CraftCreateDto implements ICraftCreateDto {
  @ApiProperty({
    type: SemiNftDto,
  })
  @ValidateNested()
  @Type(() => SemiNftDto)
  public item: InstanceType<typeof SemiNftDto>;

  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public price: InstanceType<typeof NotNativeDto>;
}
