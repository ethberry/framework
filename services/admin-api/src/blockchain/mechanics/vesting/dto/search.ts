import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsEthereumAddress, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { IVestingSearchDto, VestingContractTemplate } from "@framework/types";

export class VestingSearchDto extends PaginationDto implements IVestingSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase()))
  public account: string;

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
}
