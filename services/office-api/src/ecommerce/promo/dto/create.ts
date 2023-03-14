import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

import { IPromoCreateDto } from "../interfaces";

export class PromoCreateDto implements IPromoCreateDto {
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
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;
}
