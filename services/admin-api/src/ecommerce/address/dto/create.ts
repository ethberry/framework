import { EnabledCountries } from "@gemunion/constants";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsString } from "class-validator";

import { IAddressCreateDto } from "../interfaces";

export class AddressCreateDto implements IAddressCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public addressLine1: string;

  @ApiPropertyOptional()
  @IsString({ message: "typeMismatch" })
  public addressLine2: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public city: string;

  @ApiProperty({
    enum: EnabledCountries,
  })
  @Transform(({ value }) => value as EnabledCountries)
  @IsEnum(EnabledCountries, { message: "badInput" })
  public country: EnabledCountries;

  @ApiPropertyOptional()
  @IsString({ message: "typeMismatch" })
  public state: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public userId: number;

  @ApiPropertyOptional()
  @IsBoolean({ message: "typeMismatch" })
  public isDefault: boolean;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public zip: string;
}
