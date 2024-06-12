import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsInt, IsISO8601, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";
import { decorate } from "ts-mixer";

import { IVestingContractDeployDto, VestingContractTemplates } from "@framework/types";

export class VestingContractDeployDto implements IVestingContractDeployDto {
  @decorate(
    ApiProperty({
      enum: VestingContractTemplates,
    }),
  )
  @decorate(Transform(({ value }) => value as VestingContractTemplates))
  @decorate(IsEnum(VestingContractTemplates, { message: "badInput" }))
  public contractTemplate: VestingContractTemplates;

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

  @decorate(
    ApiProperty({
      type: String,
    }),
  )
  @decorate(IsString({ message: "typeMismatch" }))
  public externalId: string;
}
