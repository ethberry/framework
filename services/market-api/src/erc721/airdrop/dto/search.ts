import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsString, IsEnum, IsEthereumAddress, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { Erc721AirdropStatus, IErc721AirdropSearchDto } from "@framework/types";

export class Erc721AirdropSearchDto extends SearchDto implements IErc721AirdropSearchDto {
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
  public erc721TemplateIds: Array<number>;

  @ApiPropertyOptional({
    enum: Erc721AirdropStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @Transform(({ value }) => value as Array<Erc721AirdropStatus>)
  @IsEnum(Erc721AirdropStatus, { each: true, message: "badInput" })
  public airdropStatus: Array<Erc721AirdropStatus>;
}
