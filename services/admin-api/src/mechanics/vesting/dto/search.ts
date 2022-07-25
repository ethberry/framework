import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IVestingSearchDto, VestingContractTemplate } from "@framework/types";

export class VestingSearchDto extends SearchDto implements IVestingSearchDto {
  @ApiPropertyOptional({
    enum: VestingContractTemplate,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<VestingContractTemplate>)
  @IsEnum(VestingContractTemplate, { each: true, message: "badInput" })
  public contractTemplate: Array<VestingContractTemplate>;

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
  public erc20TokenIds: Array<number>;
}
