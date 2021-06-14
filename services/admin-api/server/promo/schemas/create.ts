import {ApiProperty} from "@nestjs/swagger";

import {IsNumber, IsString} from "@trejgun/nest-js-validators";

import {IPromoCreateDto} from "../interfaces";

export class PromoCreateSchema implements IPromoCreateDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsNumber({
    minimum: 1,
  })
  public productId: number;

  @ApiProperty()
  @IsString()
  public imageUrl: string;
}
