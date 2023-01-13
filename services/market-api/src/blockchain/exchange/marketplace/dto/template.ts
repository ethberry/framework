import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

import { AccountDto } from "@gemunion/collection";

import { ISignTemplateDto } from "../interfaces";

export class SignTemplateDto extends AccountDto implements ISignTemplateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public templateId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase()))
  public referrer: string;
}
