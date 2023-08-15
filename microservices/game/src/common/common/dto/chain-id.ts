import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { decorate } from "ts-mixer";

export class ChainIdDto {
  @decorate(
    ApiProperty({
      type: Number,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(1, { each: true, message: "rangeUnderflow" }))
  @decorate(Type(() => Number))
  public chainId: number;
}
