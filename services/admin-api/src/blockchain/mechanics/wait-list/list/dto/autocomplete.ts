import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import type { IWaitListListAutocompleteDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

export class WaitListListAutocompleteDto implements IWaitListListAutocompleteDto {
  @ApiPropertyOptional({
    enum: ContractStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ContractStatus>)
  @IsEnum(ContractStatus, { each: true, message: "badInput" })
  public contractStatus: Array<ContractStatus>;

  @ApiPropertyOptional()
  @IsOptional()
  // https://github.com/typestack/class-transformer/issues/626
  @Transform(({ value }) => {
    return [true, "true"].includes(value);
  })
  @IsBoolean({ message: "typeMismatch" })
  public isRewardSet: boolean;
}
