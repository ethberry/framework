import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, Min } from "class-validator";

import { IProductPromoCreateDto } from "../interfaces";

export class ProductPromoCreateDto implements IProductPromoCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public productId: number;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;
}
