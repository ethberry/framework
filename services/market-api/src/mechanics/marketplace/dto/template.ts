import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

import { ISignTemplateDto } from "../interfaces";

export class SignTemplateDto implements ISignTemplateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public templateId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public account: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public referral: string;
}
