import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

import { IAddressCreateDto } from "../interfaces";

export class AddressCreateDto implements IAddressCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public address: string;

  @ApiPropertyOptional()
  @IsBoolean({ message: "typeMismatch" })
  public isDefault: boolean;
}
