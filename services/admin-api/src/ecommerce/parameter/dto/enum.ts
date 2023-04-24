import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IParameterEnumDto } from "../interfaces/enum";

export class ParameterEnumDto implements IParameterEnumDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public parameterName: string;
}
