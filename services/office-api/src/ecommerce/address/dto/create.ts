import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsBoolean, IsInt, IsString } from "class-validator";

import { IAddressCreateDto } from "../interfaces";

export class AddressCreateDto implements IAddressCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public address: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public userId: number;

  @ApiPropertyOptional()
  @IsBoolean({ message: "typeMismatch" })
  public isDefault: boolean;
}
