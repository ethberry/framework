import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsInt, IsJSON, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

// import { rePhoneNumber } from "@framework/constants";
import { IMerchantCreateDto } from "../interfaces";

export class MerchantCreateDto implements IMerchantCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  // @Matches(rePhoneNumber, { message: "patternMismatch" })
  public phoneNumber: string;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
  })
  @IsOptional()
  @IsInt({ each: true, message: "typeMismatch" })
  public userIds: Array<number>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public imageUrl = "";
}
