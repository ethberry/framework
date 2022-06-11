import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsJSON, IsString, MaxLength, Validate } from "class-validator";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { Erc20TokenTemplate } from "@framework/types";

import { IErc20TokenCreateDto } from "../interfaces";

export class Erc20TokenCreateDto implements IErc20TokenCreateDto {
  @ApiProperty({
    enum: Erc20TokenTemplate,
  })
  @IsEnum(Erc20TokenTemplate, { message: "badInput" })
  @Validate(ForbidEnumValues, [Erc20TokenTemplate.SIMPLE, Erc20TokenTemplate.BLACKLIST])
  public contractTemplate: Erc20TokenTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(5, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsEthereumAddress({ message: "patternMismatch" })
  public address: string;
}
