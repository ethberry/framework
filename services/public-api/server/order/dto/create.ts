import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "@trejgun/nest-js-validators";

import {IOrderCreateDto} from "../interfaces";

export class OrderCreateDto implements IOrderCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsNumber({
    minimum: 1,
  })
  public productId: number;
}
