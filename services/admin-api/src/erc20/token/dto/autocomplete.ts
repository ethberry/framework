import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { Erc20TokenStatus, Erc20TokenTemplate, IErc20TokenAutocompleteDto } from "@framework/types";

export class Erc20TokenAutocompleteDto implements IErc20TokenAutocompleteDto {
  @ApiPropertyOptional({
    enum: Erc20TokenTemplate,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc20TokenTemplate>)
  @IsEnum(Erc20TokenTemplate, { each: true, message: "badInput" })
  public contractTemplate: Array<Erc20TokenTemplate>;

  @ApiPropertyOptional({
    enum: Erc20TokenStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc20TokenStatus>)
  @IsEnum(Erc20TokenStatus, { each: true, message: "badInput" })
  public tokenStatus: Array<Erc20TokenStatus>;
}
