import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IIngredientsDto } from "../interfaces/ingredients";

export class IngredientsDto implements IIngredientsDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc1155TokenId: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public amount: number;
}
