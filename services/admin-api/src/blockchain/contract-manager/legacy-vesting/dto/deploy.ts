import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsInt, IsISO8601, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";
import { decorate } from "ts-mixer";

import { ILegacyVestingContractDeployDto, LegacyVestingContractTemplates } from "@framework/types";

export class LegacyVestingContractDeployDto implements ILegacyVestingContractDeployDto {
  @decorate(
    ApiProperty({
      enum: LegacyVestingContractTemplates,
    }),
  )
  @decorate(Transform(({ value }) => value as LegacyVestingContractTemplates))
  @decorate(IsEnum(LegacyVestingContractTemplates, { message: "badInput" }))
  public contractTemplate: LegacyVestingContractTemplates;

  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsString({ message: "typeMismatch" }))
  @decorate(IsEthereumAddress({ message: "patternMismatch" }))
  @decorate(Transform(({ value }: { value: string }) => value.toLowerCase()))
  public owner: string;

  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsString({ message: "typeMismatch" }))
  @decorate(IsISO8601({}, { message: "patternMismatch" }))
  public startTimestamp: string;

  @decorate(
    ApiProperty({
      type: Number,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(0, { message: "rangeUnderflow" }))
  public cliffInMonth: number;

  @decorate(
    ApiProperty({
      type: Number,
    }),
  )
  @decorate(IsInt({ message: "typeMismatch" }))
  @decorate(Min(1, { message: "rangeUnderflow" }))
  @decorate(Max(10000, { message: "rangeOverflow" }))
  public monthlyRelease: number;
}
