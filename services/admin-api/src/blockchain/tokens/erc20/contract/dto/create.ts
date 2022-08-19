import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsJSON, IsString, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";
import { IErc20ContractCreateDto } from "@framework/types";

export class Erc20ContractCreateDto implements IErc20ContractCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public decimals: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public address: string;
}
