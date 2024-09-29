import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { Mixin } from "ts-mixer";

import { SearchDto } from "@ethberry/collection";
import { AddressOptionalDto } from "@ethberry/nest-js-validators";
import type { IContractManagerSearchDto } from "@framework/types";
import { ContractType } from "@framework/types";

export class ContractManagerSearchDto
  extends Mixin(SearchDto, AddressOptionalDto)
  implements IContractManagerSearchDto
{
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
