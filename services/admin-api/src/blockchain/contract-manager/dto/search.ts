import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { IContractManagerSearchDto, ContractType } from "@framework/types";

export class ContractManagerSearchDto extends SearchDto implements IContractManagerSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }) => (value === "" ? null : (value as string)))
  public address: string;

  @ApiPropertyOptional({
    enum: ContractType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @Transform(({ value }) => value as Array<ContractType>)
  @IsEnum(ContractType, { each: true, message: "badInput" })
  public contractType: Array<ContractType>;
}
