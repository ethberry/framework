import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsEthereumAddress, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { Erc998AirdropStatus, IErc998AirdropSearchDto } from "@framework/types";

export class Erc998AirdropSearchDto extends SearchDto implements IErc998AirdropSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public query: string;

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
  public erc998TemplateIds: Array<number>;

  @ApiPropertyOptional({
    enum: Erc998AirdropStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @Transform(({ value }) => value as Array<Erc998AirdropStatus>)
  @IsEnum(Erc998AirdropStatus, { each: true, message: "badInput" })
  public airdropStatus: Array<Erc998AirdropStatus>;
}
