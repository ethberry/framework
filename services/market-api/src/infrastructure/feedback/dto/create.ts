import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

import { IFeedbackCreateDto } from "../interfaces";

export class FeedbackCreateDto implements IFeedbackCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MinLength(42, { message: "rangeOverflow" })
  public text: string;
}
