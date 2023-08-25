import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ICraftCreateDto } from "../interfaces";
import { ItemDto } from "../../../exchange/asset/dto";

export class CraftCreateDto implements ICraftCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public price: ItemDto;

  @ApiProperty()
  @Transform(({ value }) => {
    return [true, "true"].includes(value);
  })
  @IsBoolean({ message: "typeMismatch" })
  public inverse: boolean;
}
