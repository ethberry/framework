import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ITokenAutocompleteDto } from "@framework/types";

export class TokenAutocompleteDto implements ITokenAutocompleteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public account: string;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public contractIds: Array<number>;
}
