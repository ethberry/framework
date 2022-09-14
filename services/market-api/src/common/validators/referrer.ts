import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEthereumAddress, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { decorate } from "ts-mixer";

export class ReferrerOptionalDto {
  @decorate(ApiPropertyOptional())
  @decorate(IsOptional())
  @decorate(IsString({ message: "typeMismatch" }))
  @decorate(IsEthereumAddress({ message: "patternMismatch" }))
  @decorate(Transform(({ value }: { value: string }) => (value === "" ? null : value.toLowerCase())))
  public referrer: string;
}
