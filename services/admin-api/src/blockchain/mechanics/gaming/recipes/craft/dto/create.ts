import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SemiNftDto, AllTypesDto } from "../../../../../exchange/asset/dto";
import type { ICraftCreateDto } from "../interfaces";

export class CraftCreateDto implements ICraftCreateDto {
  @ApiProperty({
    type: SemiNftDto,
  })
  @ValidateNested()
  @Type(() => SemiNftDto)
  public item: InstanceType<typeof SemiNftDto>;

  @ApiProperty({
    type: AllTypesDto,
  })
  @ValidateNested()
  @Type(() => AllTypesDto)
  public price: InstanceType<typeof AllTypesDto>;
}
