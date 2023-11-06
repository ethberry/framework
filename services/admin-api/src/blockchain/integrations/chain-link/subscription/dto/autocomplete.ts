import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";
import { Transform } from "class-transformer";

export interface ISubscriptionAutocompleteDto {
  chainId: number;
  merchantId: number;
}

export class SubscriptionAutocompleteDto implements ISubscriptionAutocompleteDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public chainId: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public merchantId: number;
}
