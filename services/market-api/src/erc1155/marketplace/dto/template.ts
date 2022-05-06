import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, Min } from "class-validator";

import { ISignTokensDto } from "../interfaces";

export class SignTokenDto implements ISignTokensDto {
  @ApiProperty({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  public erc1155TokenIds: Array<number>;

  @ApiProperty({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  public amounts: Array<number>;
}
