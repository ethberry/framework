import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import { ITokenHistorySearchDto } from "@framework/types";
import { IsBigNumber } from "@gemunion/nest-js-validators";

export class ContractHistorySearchDto extends PaginationDto implements ITokenHistorySearchDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public token: string;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigNumber({}, { message: "typeMismatch" })
  public tokenId: string;
}
