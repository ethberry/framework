import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IVestingSearchDto, VestingContractTemplate } from "@framework/types";

export class VestingSearchDto extends PaginationDto implements IVestingSearchDto {
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

  public account: string;
}
